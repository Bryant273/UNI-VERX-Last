use crate::models::{User, UserLogin, UserRegistration, AuthResponse};
use actix_web::{post, web, HttpResponse, Responder};
use sqlx::PgPool;
use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    role: String,
    jti: String,
    exp: usize,
}

#[post("/api/auth/register")]
pub async fn register(
    pool: web::Data<PgPool>,
    user: web::Json<UserRegistration>,
) -> impl Responder {
    use argon2::{
        password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
        Argon2
    };

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(user.password.as_bytes(), &salt)
        .expect("Failed to hash password")
        .to_string();

    let result = sqlx::query!(
        "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id",
        user.username,
        password_hash,
        user.role
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Created().json("User registered successfully"),
        Err(e) => HttpResponse::InternalServerError().json(format!("Error registering user: {}", e)),
    }
}

#[post("/api/auth/login")]
pub async fn login(
    pool: web::Data<PgPool>,
    creds: web::Json<UserLogin>,
) -> impl Responder {
    use argon2::{
        password_hash::{PasswordHash, PasswordVerifier},
        Argon2
    };

    let user = sqlx::query_as!(
        User,
        "SELECT id, username, password_hash, role, created_at FROM users WHERE username = $1",
        creds.username
    )
    .fetch_optional(pool.get_ref())
    .await;

    match user {
        Ok(Some(u)) => {
            let parsed_hash = PasswordHash::new(&u.password_hash).expect("Invalid hash in database");
            if Argon2::default().verify_password(creds.password.as_bytes(), &parsed_hash).is_ok() {
                let expiration = Utc::now()
                    .checked_add_signed(Duration::hours(24))
                    .expect("valid timestamp")
                    .timestamp();

                let claims = Claims {
                    sub: u.username.clone(),
                    role: u.role.clone(),
                    jti: uuid::Uuid::new_v4().to_string(),
                    exp: expiration as usize,
                };

                // ... rest of JWT logic

                let token = encode(
                    &Header::default(),
                    &claims,
                    &EncodingKey::from_secret("secret_key".as_ref()), // SHOULD BE FROM ENV
                )
                .unwrap();

                HttpResponse::Ok().json(AuthResponse {
                    token,
                    role: u.role,
                    username: u.username,
                })
            } else {
                HttpResponse::Unauthorized().json("Invalid credentials")
            }
        }
        Ok(None) => HttpResponse::Unauthorized().json("Invalid credentials"),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

#[post("/api/auth/logout")]
pub async fn logout(
    redis: web::Data<redis::Client>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    use jsonwebtoken::{decode, DecodingKey, Validation};
    use redis::AsyncCommands;

    let auth_header = req.header("Authorization");
    if let Some(header_value) = auth_header {
        let auth_str = header_value.to_str().unwrap_or("");
        if auth_str.starts_with("Bearer ") {
            let token = &auth_str[7..];
            
            // Decodes without validation to get JTI and expiry (we just need the metadata)
            let mut validation = Validation::default();
            validation.validate_exp = false; // We want to blacklist even if expired locally
            
            let token_data = decode::<Claims>(
                token,
                &DecodingKey::from_secret("secret_key".as_ref()),
                &validation,
            );

            if let Ok(data) = token_data {
                let mut conn = redis.get_async_connection().await.unwrap();
                let key = format!("blacklist_{}", data.claims.jti);
                let ttl = data.claims.exp as i64 - Utc::now().timestamp();
                
                if ttl > 0 {
                    let _: () = conn.set_ex(key, "revoked", ttl as u64).await.unwrap();
                }
            }
        }
    }

    HttpResponse::Ok().json("Logged out successfully")
}

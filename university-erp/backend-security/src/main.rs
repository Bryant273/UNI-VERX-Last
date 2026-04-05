mod models;
mod handlers;

use actix_web::{get, App, HttpResponse, HttpServer, Responder, web, middleware, dev::ServiceRequest, Error};
use sqlx::postgres::PgPoolOptions;
use dotenvy::dotenv;
use std::env;
use dashmap::DashMap;

#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

#[get("/api/auth/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json("Auth API is up and running!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1/".to_string());
    let redis_client = redis::Client::open(redis_url).expect("Failed to connect to Redis");

    println!("Starting Security Backend on port 8081...");
    
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");

    let ip_reputation: web::Data<DashMap<String, i32>> = web::Data::new(DashMap::new());

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(redis_client.clone()))
            .app_data(ip_reputation.clone())
            .wrap_fn(|req, srv| {
                // Zero-copy predictive IP reputation defender
                if let Some(ip) = req.peer_addr().map(|a| a.ip().to_string()) {
                    if let Some(mut score) = req.app_data::<web::Data<DashMap<String, i32>>>().unwrap().get_mut(&ip) {
                        if *score < -50 {
                            return Box::pin(async {
                                Ok(req.into_response(HttpResponse::TooManyRequests().finish()))
                            });
                        }
                        *score -= 1; // Decrease reputation per request (simplified chaos detection)
                    } else {
                        req.app_data::<web::Data<DashMap<String, i32>>>().unwrap().insert(ip, 100);
                    }
                }
                
                let fut = actix_web::dev::Service::call(&srv, req);
                Box::pin(async move {
                    let res = fut.await?;
                    Ok(res)
                })
            })
            .service(health_check)
            .service(handlers::register)
            .service(handlers::login)
            .service(handlers::logout)
    })
    .bind(("0.0.0.0", 8081))?
    .workers(8) // Maximize concurrency
    .run()
    .await
}

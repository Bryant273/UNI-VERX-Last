mod models;
mod handlers;

use actix_web::{get, App, HttpResponse, HttpServer, Responder, web};
use sqlx::postgres::PgPoolOptions;
use dotenvy::dotenv;
use std::env;

#[get("/api/auth/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json("Auth API is up and running!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1/".to_string());
    let redis_client = redis::Client::open(redis_url).expect("Failed to connect to Redis");

    println!("Starting Security Backend on port 8001...");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(redis_client.clone()))
            .service(health_check)
            .service(handlers::register)
            .service(handlers::login)
            .service(handlers::logout)
    })
    .bind(("127.0.0.1", 8001))?
    .run()
    .await
}

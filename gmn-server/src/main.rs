use actix_cors::Cors;
use actix_web::{App, HttpServer};
use gmn_api::configure_api;
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    
    HttpServer::new(|| {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .configure(configure_api)  
    })
    .bind(("0.0.0.0", 3001))?
    .run()
    .await
}
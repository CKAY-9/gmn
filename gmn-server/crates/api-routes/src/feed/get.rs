use actix_web::{HttpResponse, Responder, get};

#[get("/explore")]
pub async fn get_explore_posts() -> Result<impl Responder, Box<dyn std::error::Error>> {
    Ok(HttpResponse::Ok().body("body"))
}

#[get("")]
pub async fn get_post() -> Result<impl Responder, Box<dyn std::error::Error>> {
    Ok(HttpResponse::Ok().body("body"))
}

#[get("")]
pub async fn get_feed_posts() -> Result<impl Responder, Box<dyn std::error::Error>> {
    Ok(HttpResponse::Ok().body("body"))
}
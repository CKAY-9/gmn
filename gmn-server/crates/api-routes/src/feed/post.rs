use std::time::SystemTime;

use actix_web::{ http::StatusCode, post, web, HttpRequest, HttpResponse, Responder };
use gmn_db::crud::{post::create_post, user::get_user_from_token};
use gmn_db_schema::models::NewPost;
use gmn_utils::{extract_header_value, iso8601};

use crate::dto::Message;

use super::dto::NewPostDTO;

#[post("")]
pub async fn new_post(
    request: HttpRequest,
    data: web::Data<NewPostDTO>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message {
                message: "Failed to get user token".to_string(),
            })
        );
    }

    let user_option = get_user_from_token(token_option.unwrap());
    if user_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get user".to_string(),
            })
        );
    }

    let user = user_option.unwrap();

    // TODO: handle files
    let n_post = NewPost {
        title: data.title.clone(),
        description: data.description.clone(),
        date: iso8601(&SystemTime::now()),
        files: data.files.clone(),
        user_id: user.id
    };
    let insert = create_post(n_post);
    match insert {
        Some(p) => Ok(HttpResponse::Ok().json(p)),
        None => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
            message: "Failed to create post".to_string()
        }))
    }
}

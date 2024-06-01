use actix_web::{http::StatusCode, put, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{
    post::{get_post_from_id, update_post_from_id},
    user::get_user_from_token,
};
use gmn_db_schema::models::NewPost;
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::UpdatePostDTO;

#[put("")]
pub async fn update_feed_post(
    request: HttpRequest,
    data: web::Json<UpdatePostDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to get user token".to_string(),
            }));
    }

    let user_option = get_user_from_token(token_option.unwrap());
    if user_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get user".to_string(),
            }));
    }

    let user = user_option.unwrap();

    let post_option = get_post_from_id(data.post_id);
    if post_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get post".to_string(),
            }));
    }

    let mut post = post_option.unwrap();
    if post.user_id != user.id {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::UNAUTHORIZED)
            .json(Message {
                message: "Invalid permissions".to_string(),
            }));
    }

    post.title = data.title.clone();
    post.description = data.description.clone();

    let post_update =
        serde_json::from_str::<NewPost>(serde_json::to_string(&post).unwrap().as_str()).unwrap();
    let update = update_post_from_id(post.id, post_update);
    match update {
        Some(u) => Ok(HttpResponse::Ok().json(u)),
        None => Ok(HttpResponse::Ok()
            .status(StatusCode::UNAUTHORIZED)
            .json(Message {
                message: "Failed to update post".to_string(),
            })),
    }
}

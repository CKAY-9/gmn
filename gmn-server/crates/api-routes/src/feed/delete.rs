use actix_web::{delete, http::StatusCode, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{post::{delete_post_from_id, get_post_from_id}, user::get_user_from_token};
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::GetPostDTO;

#[delete("")]
pub async fn delete_feed_post(
    request: HttpRequest,
    data: web::Json<GetPostDTO>,
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

    let post = post_option.unwrap();
    if post.user_id != user.id {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::UNAUTHORIZED)
            .json(Message {
                message: "Invalid permissions".to_string(),
            }));
    }

	let delete_post = delete_post_from_id(post.id);
	match delete_post {
		Some(_p) => Ok(HttpResponse::Ok().json(Message {
			message: "Deleted post".to_string()
		})),
		None => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
			message: "Failed to delete post".to_string()
		}))
	}
}

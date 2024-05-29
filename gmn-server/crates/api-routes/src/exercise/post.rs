use actix_web::{http::StatusCode, post, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{exercise::create_exercise, user::get_user_from_token};
use gmn_db_schema::models::NewExercise;
use gmn_utils::extract_header_value;

use crate::dto::Message;

#[post("")]
pub async fn new_exercise(
    request: HttpRequest,
    data: web::Json<NewExercise>,
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

	let insert = create_exercise(NewExercise {
        name: data.name.clone(),
        description: data.description.clone(),
        example_video: data.example_video.clone()
    });

    match insert {
        Some(e) => {
            Ok(HttpResponse::Ok().json(e))
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
                message: "Failed to create exercise".to_string()
            }))
        }
    }
}

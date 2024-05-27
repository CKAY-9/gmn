use actix_web::{http::StatusCode, post, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::user::get_user_from_token;
use gmn_db_schema::models::NewExercise;
use gmn_utils::extract_header_value;

use crate::dto::Message;

#[post("")]
pub async fn new_exercise(
    request: HttpRequest,
    _data: web::Json<NewExercise>,
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

    let mut _user = user_option.unwrap();

	// TODO: check usergroup / permissions

	

    Ok(HttpResponse::Ok().body("body"))
}

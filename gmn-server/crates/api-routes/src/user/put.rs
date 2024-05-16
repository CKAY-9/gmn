use actix_web::{http::StatusCode, put, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::user::{get_user_from_token, update_user_from_id};
use gmn_utils::extract_header_value;
use crate::dto::Message;
use super::dto::{UpdateRecordsDTO, UpdateUserDTO};

#[put("")]
pub async fn update_user(
    request: HttpRequest,
    data: web::Json<UpdateUserDTO>,
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

    let mut user = user_option.unwrap();
	user.bio = data.bio.clone();

	let update = serde_json::from_str(serde_json::to_string(&user).unwrap().as_str()).unwrap();
    let update_result = update_user_from_id(user.id, update);
    match update_result {
        Some(u) => Ok(HttpResponse::Ok().json(u)),
        None => Ok(HttpResponse::Ok()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .json(Message {
                message: "Failed to update user".to_string(),
            })),
    }
}

#[put("/prs")]
pub async fn update_personal_reconds(
    request: HttpRequest,
    data: web::Json<UpdateRecordsDTO>,
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

    let mut user = user_option.unwrap();
    if user.personal_records.len() <= 3 {
        user.personal_records = vec![0, 0, 0];
    }

    user.personal_records[0] = data.bench;
    user.personal_records[1] = data.squat;
    user.personal_records[2] = data.deadlift;

    let update = serde_json::from_str(serde_json::to_string(&user).unwrap().as_str()).unwrap();
    let update_result = update_user_from_id(user.id, update);
    match update_result {
        Some(u) => Ok(HttpResponse::Ok().json(u)),
        None => Ok(HttpResponse::Ok()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .json(Message {
                message: "Failed to update user".to_string(),
            })),
    }
}

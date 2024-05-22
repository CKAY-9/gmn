use actix_web::{http::StatusCode, put, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{
    macros::{get_macros_from_id, update_macros_from_id},
    user::get_user_from_token,
};
use gmn_db_schema::models::NewMacros;
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::{EntriesDTO, UpdateEntriesDTO};

#[put("/entries")]
pub async fn update_entries(
    request: HttpRequest,
    data: web::Json<UpdateEntriesDTO>,
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
    let macros_option = get_macros_from_id(data.macro_id);
    if macros_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get macros".to_string(),
            }));
    }

    let mut macros = macros_option.unwrap();
    if macros.user_id != user.id {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::UNAUTHORIZED)
            .json(Message {
                message: "Invalid permissions".to_string(),
            }));
    }

    macros.entries = data.entries.clone();
    macros.calories = 0;
    macros.carbs = 0;
    macros.fats = 0;
    macros.protein = 0;
    for entry in macros.clone().entries {
        let parse = serde_json::from_str::<EntriesDTO>(&entry);
        match parse {
            Ok(p) => {
                // json string things
                macros.calories += p.calories.parse::<i32>().unwrap();
                macros.fats += p.fats.parse::<i32>().unwrap();
                macros.protein += p.protein.parse::<i32>().unwrap();
                macros.carbs += p.carbs.parse::<i32>().unwrap();
            },
            Err(_e) => continue
        }
    }
    
    let update =
        serde_json::from_str::<NewMacros>(serde_json::to_string(&macros).unwrap().as_str())
            .unwrap();
    let update_option = update_macros_from_id(macros.id, update);
    match update_option {
        Some(m) => Ok(HttpResponse::Ok().json(m)),
        None => Ok(HttpResponse::Ok()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .json(Message {
                message: "Failed to update entries".to_string(),
            })),
    }
}

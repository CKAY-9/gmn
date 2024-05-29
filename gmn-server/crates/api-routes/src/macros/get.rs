use std::time::{Duration, SystemTime};

use super::{dto::GetMacrosDTO, helpers::get_macros_from_date};
use crate::dto::Message;
use actix_web::{get, http::StatusCode, web, HttpResponse, Responder};
use gmn_db::crud::{macros::get_macros_from_user_id, user::get_user_from_id};
use gmn_db_schema::models::Macros;
use gmn_utils::iso8601;

#[get("")]
pub async fn get_macros(
    query: web::Query<GetMacrosDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user_option = get_user_from_id(query.user_id);
    if user_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get user".to_string(),
            }));
    }

    let user = user_option.unwrap();
    let macros = get_macros_from_user_id(user.id);
    let valid_date_from_query = query.date.len() >= 1;
    let date_to_get = match valid_date_from_query {
        true => query.date.clone().to_string(),
        false => {
            // :(
            let temp = iso8601::date(iso8601(&SystemTime::now()).as_str()).unwrap();
            temp.to_string()
        }
    };

    let today_macros = get_macros_from_date(user.id, macros, date_to_get, None);
    Ok(HttpResponse::Ok().json(today_macros))
}

#[get("/weekly")]
pub async fn get_weekly_macros(
    query: web::Query<GetMacrosDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user_option = get_user_from_id(query.user_id);
    if user_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get user".to_string(),
            }));
    }

    let user = user_option.unwrap();
    let macros = get_macros_from_user_id(user.id);
    let sys_now = SystemTime::now();

    let mut final_macros: Vec<Macros> = vec![];
    for i in 0..7 {
        let date = sys_now.clone().checked_sub(Duration::new(60 * 60 * 24 * i, 0)).unwrap();
        let temp_macros = get_macros_from_date(user.id, macros.clone(), iso8601::date(iso8601(&date).as_str()).unwrap().to_string(), Some(date));
        final_macros.push(temp_macros);
    }

    Ok(HttpResponse::Ok().json(final_macros))
}

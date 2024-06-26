use std::time::SystemTime;

use super::{dto::GetWorkoutsDTO, helpers::get_workouts_from_date};
use crate::{dto::Message, goals::helpers::get_total_activity_level, user::dto::GetUserDTO};
use actix_web::{get, http::StatusCode, web, HttpResponse, Responder};
use gmn_db::crud::{goals::{get_personal_goal_from_user_id, update_personal_goal_from_id}, user::get_user_from_id, workout::get_workouts_from_user_id};
use gmn_db_schema::models::NewPersonalGoal;
use gmn_utils::iso8601;

#[get("")]
pub async fn get_workout(
    query: web::Query<GetWorkoutsDTO>,
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
    let workouts = get_workouts_from_user_id(user.id);
    let valid_date_from_query = query.date.len() >= 1;
    let date_to_get = match valid_date_from_query {
        true => query.date.clone().to_string(),
        false => {
            // :(
            let temp = iso8601::date(iso8601(&SystemTime::now()).as_str()).unwrap();
            temp.to_string()
        }
    };

    let workout = get_workouts_from_date(user.id, workouts, date_to_get);

    let goals_option = get_personal_goal_from_user_id(user.id);
    if goals_option.is_some() {
        let mut goals = goals_option.unwrap();
        goals.activity_level = get_total_activity_level(workout.clone());
        let goal_update = serde_json::from_str::<NewPersonalGoal>(serde_json::to_string(&goals).unwrap().as_str()).unwrap();
        let _ = update_personal_goal_from_id(goals.id, goal_update);
    }

    Ok(HttpResponse::Ok().json(workout))
}

#[get("/all")]
pub async fn get_all_workouts(
    query: web::Query<GetUserDTO>,
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
    let workouts = get_workouts_from_user_id(user.id);
    Ok(HttpResponse::Ok().json(workouts))
}
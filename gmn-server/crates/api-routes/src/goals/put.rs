use actix_web::{http::StatusCode, put, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{goals::{get_personal_goal_from_id, update_personal_goal_from_id}, user::get_user_from_token};
use gmn_db_schema::models::NewPersonalGoal;
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::UpdateGoalsDTO;

#[put("")]
pub async fn update_goals(
    request: HttpRequest,
    data: web::Json<UpdateGoalsDTO>,
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
    let goals_option = get_personal_goal_from_id(data.goal_id);
    if goals_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get goals".to_string(),
            }));
    }

	let mut goals = goals_option.unwrap();
	if goals.user_id != user.id {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::UNAUTHORIZED)
            .json(Message {
                message: "Invalid permissions".to_string(),
            }));
	}

	goals.weight = data.weight;
	goals.height = data.height;
	goals.activity_goal = data.activity_goal;
	goals.calorie_goal = data.calorie_goal;
	goals.weight_goal = data.weight_goal;
	let goals_update = serde_json::from_str::<NewPersonalGoal>(serde_json::to_string(&goals).unwrap().as_str()).unwrap();
	let update = update_personal_goal_from_id(goals.id, goals_update);
	match update {
		Some(p) => Ok(HttpResponse::Ok().json(p)),
		None => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
			message: "Failed to update goal".to_string()
		}))
	}
}

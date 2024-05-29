use actix_web::{get, http::StatusCode, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::{
    goals::{create_personal_goal, get_personal_goal_from_id},
    user::get_user_from_token,
};
use gmn_db_schema::models::NewPersonalGoal;
use gmn_utils::extract_header_value;

use crate::{dto::Message, user::dto::GetUserOptionDTO};

#[get("")]
pub async fn get_goals(
    request: HttpRequest,
    query: web::Query<GetUserOptionDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let id: Option<i32> = query.user_id;
    match id {
        Some(user_id) => {
            let goal_option = get_personal_goal_from_id(user_id);
            match goal_option {
                Some(g) => Ok(HttpResponse::Ok().json(g)),
                None => Ok(HttpResponse::Ok()
                    .status(StatusCode::NOT_FOUND)
                    .json(Message {
                        message: "Failed to get goals".to_string(),
                    })),
            }
        }
        None => {
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
            let goal_option = get_personal_goal_from_id(user.id);
            match goal_option {
                Some(g) => Ok(HttpResponse::Ok().json(g)),
                None => {
                    let g_option = create_personal_goal(NewPersonalGoal {
                        user_id: user.id,
                        height: 0,
                        weight: 0,
                        activity_goal: 0,
                        activity_level: 0,
                        calorie_goal: 0,
                        weight_goal: 0,
                    });
                    match g_option {
                        Some(g) => Ok(HttpResponse::Ok().json(g)),
                        None => Ok(HttpResponse::Ok()
                            .status(StatusCode::INTERNAL_SERVER_ERROR)
                            .json(Message {
                                message: "Failed to get goals".to_string(),
                            })),
                    }
                }
            }
        }
    }
}

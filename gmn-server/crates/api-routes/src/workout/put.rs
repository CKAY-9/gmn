use actix_web::{ http::StatusCode, put, web, HttpRequest, HttpResponse, Responder };
use gmn_db::crud::{
    workout::{ get_workout_from_id, update_workout_from_id },
    user::get_user_from_token,
};
use gmn_db_schema::models::NewWorkout;
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::{ UpdateEntriesDTO, UpdateWorkoutInfoDTO };

#[put("/entries")]
pub async fn update_workout_entries(
    request: HttpRequest,
    data: web::Json<UpdateEntriesDTO>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message {
                message: "Failed to get user token".to_string(),
            })
        );
    }

    let user_option = get_user_from_token(token_option.unwrap());
    if user_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get user".to_string(),
            })
        );
    }

    let user = user_option.unwrap();
    let workout_option = get_workout_from_id(data.workout_id);
    if workout_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get workout".to_string(),
            })
        );
    }

    let mut workout = workout_option.unwrap();
    if workout.user_id != user.id {
        return Ok(
            HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message {
                message: "Invalid permissions".to_string(),
            })
        );
    }

    workout.exercises = data.exercises.clone();

    let update = serde_json
        ::from_str::<NewWorkout>(serde_json::to_string(&workout).unwrap().as_str())
        .unwrap();
    let update_option = update_workout_from_id(workout.id, update);
    match update_option {
        Some(m) => Ok(HttpResponse::Ok().json(m)),
        None =>
            Ok(
                HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
                    message: "Failed to update entries".to_string(),
                })
            ),
    }
}

#[put("/info")]
pub async fn update_workout_info(
    request: HttpRequest,
    data: web::Json<UpdateWorkoutInfoDTO>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message {
                message: "Failed to get user token".to_string(),
            })
        );
    }

    let user_option = get_user_from_token(token_option.unwrap());
    if user_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get user".to_string(),
            })
        );
    }

    let user = user_option.unwrap();
    let workout_option = get_workout_from_id(data.workout_id);
    if workout_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get workout".to_string(),
            })
        );
    }

    let mut workout = workout_option.unwrap();
    if workout.user_id != user.id {
        return Ok(
            HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message {
                message: "Invalid permissions".to_string(),
            })
        );
    }

    workout.title = data.title.clone();
    workout.description = data.description.clone();
    let update = serde_json
        ::from_str::<NewWorkout>(serde_json::to_string(&workout).unwrap().as_str())
        .unwrap();
    let update_option = update_workout_from_id(workout.id, update);
    match update_option {
        Some(m) => Ok(HttpResponse::Ok().json(m)),
        None =>
            Ok(
                HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
                    message: "Failed to update info".to_string(),
                })
            ),
    }
}

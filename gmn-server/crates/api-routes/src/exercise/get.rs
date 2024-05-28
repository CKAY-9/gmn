use actix_web::{get, http::StatusCode, web, HttpRequest, HttpResponse, Responder};
use diesel::{query_dsl::methods::{LimitDsl, OrderDsl, SelectDsl}, ExpressionMethods, QueryResult, RunQueryDsl, SelectableHelper};
use gmn_db::{create_connection, crud::exercise::get_exercise_from_id};
use gmn_db_schema::{models::Exercise, schema::exercises};

use crate::dto::Message;

use super::dto::GetExerciseDTO;

#[get("")]
pub async fn get_exercise(_request: HttpRequest, data: web::Query<GetExerciseDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
  let exercise = get_exercise_from_id(data.exercise_id.clone());
  match exercise {
    Some(e) => {
      Ok(HttpResponse::Ok().json(e))
    },
    None => {
      Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
        message: "Failed to get exercise".to_string()
      }))
    }
  }
}

#[get("/all")]
pub async fn get_all_exercises(_request: HttpRequest) -> Result<impl Responder, Box<dyn std::error::Error>> {
  let connection = &mut create_connection();
  let exercises: QueryResult<Vec<Exercise>> = exercises::table
      .select(Exercise::as_select())
      .order(exercises::id.desc())
      .limit(15)
      .load(connection);

  match exercises {
      Ok(ex) => {
          Ok(HttpResponse::Ok().json(ex))
      },
      Err(_e) => {
          let empty: Vec<usize> = vec![];
          Ok(HttpResponse::Ok().json(empty))
      }
  }
}
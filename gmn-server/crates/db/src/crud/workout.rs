use diesel::{query_dsl::methods::FilterDsl, ExpressionMethods, QueryResult, RunQueryDsl};
use gmn_db_schema::{models::{Workout, NewWorkout}, schema::workouts};

use crate::create_connection;

pub fn create_workout(new_workout: NewWorkout) -> Option<Workout> {
  let connection = &mut create_connection();
  let insert = diesel::insert_into(workouts::table).values(new_workout).get_result::<Workout>(connection);

  match insert {
      Ok(u) => { Some(u) }
      Err(_e) => { None }
  }
}

pub fn get_workout_from_id(workouts_id: i32) -> Option<Workout> {
  let connection = &mut create_connection();
  let find: QueryResult<Workout> = workouts::table
      .filter(workouts::id.eq(workouts_id))
      .first::<Workout>(connection);

  match find {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}

pub fn get_workouts_from_user_id(user_id: i32) -> Vec<Workout> {
  let connection = &mut create_connection();
  let find = workouts::table
      .filter(workouts::user_id.eq(user_id))
      .load(connection);

  match find {
      Ok(m) => { m }
      Err(_e) => { vec![] }
  }
}

pub fn update_workout_from_id(workout_id: i32, workout_update: NewWorkout) -> Option<Workout> {
  let connection = &mut create_connection();
  let update = diesel
      ::update(workouts::table)
      .filter(workouts::id.eq(workout_id))
      .set(workout_update)
      .get_result::<Workout>(connection);

  match update {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}
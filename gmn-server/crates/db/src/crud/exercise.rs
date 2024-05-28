use diesel::{query_dsl::methods::FilterDsl, ExpressionMethods, QueryResult, RunQueryDsl};
use gmn_db_schema::{models::{Exercise, NewExercise}, schema::exercises};

use crate::create_connection;

pub fn create_exercise(new_exercise: NewExercise) -> Option<Exercise> {
  let connection = &mut create_connection();
  let insert = diesel::insert_into(exercises::table).values(new_exercise).get_result::<Exercise>(connection);

  match insert {
      Ok(u) => { Some(u) }
      Err(_e) => { None }
  }
}

pub fn get_exercise_from_id(exercise_id: i32) -> Option<Exercise> {
  let connection = &mut create_connection();
  let find: QueryResult<Exercise> = exercises::table
      .filter(exercises::id.eq(exercise_id))
      .first::<Exercise>(connection);

  match find {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}

pub fn update_exercise_from_id(exercise_id: i32, exercise_update: NewExercise) -> Option<Exercise> {
  let connection = &mut create_connection();
  let update = diesel
      ::update(exercises::table)
      .filter(exercises::id.eq(exercise_id))
      .set(exercise_update)
      .get_result::<Exercise>(connection);

  match update {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}
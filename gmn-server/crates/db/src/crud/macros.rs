use diesel::{query_dsl::methods::FilterDsl, ExpressionMethods, QueryResult, RunQueryDsl};
use gmn_db_schema::{models::{Macros, NewMacros}, schema::macros};

use crate::create_connection;

pub fn create_macros(new_macros: NewMacros) -> Option<Macros> {
  let connection = &mut create_connection();
  let insert = diesel::insert_into(macros::table).values(new_macros).get_result::<Macros>(connection);

  match insert {
      Ok(u) => { Some(u) }
      Err(_e) => { None }
  }
}

pub fn get_macros_from_id(macros_id: i32) -> Option<Macros> {
  let connection = &mut create_connection();
  let find: QueryResult<Macros> = macros::table
      .filter(macros::id.eq(macros_id))
      .first::<Macros>(connection);

  match find {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}

pub fn get_macros_from_user_id(user_id: i32) -> Vec<Macros> {
  let connection = &mut create_connection();
  let find = macros::table
      .filter(macros::user_id.eq(user_id))
      .load(connection);

  match find {
      Ok(m) => { m }
      Err(_e) => { vec![] }
  }
}

pub fn update_macros_from_id(macros_id: i32, macros_update: NewMacros) -> Option<Macros> {
  let connection = &mut create_connection();
  let update = diesel
      ::update(macros::table)
      .filter(macros::id.eq(macros_id))
      .set(macros_update)
      .get_result::<Macros>(connection);

  match update {
      Ok(m) => { Some(m) }
      Err(_e) => { None }
  }
}
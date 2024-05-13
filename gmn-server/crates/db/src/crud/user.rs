use crate::create_connection;
use gmn_db_schema::{ models::{ NewUser, User }, schema::users };
use diesel::prelude::*;

pub fn create_user(new_user: NewUser) -> Option<User> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(users::table).values(new_user).get_result::<User>(connection);

    match insert {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn get_user_from_id(user_id: i32) -> Option<User> {
    let connection = &mut create_connection();
    let find: QueryResult<User> = users::table
        .filter(users::id.eq(user_id))
        .first::<User>(connection);

    match find {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn get_user_from_oauth(oauth_id: String) -> Option<User> {
    let connection = &mut create_connection();
    let find: QueryResult<User> = users::table
        .filter(users::oauth_id.eq(oauth_id))
        .first::<User>(connection);

    match find {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn get_user_from_token(token: String) -> Option<User> {
    let connection = &mut create_connection();
    let find: QueryResult<User> = users::table
        .filter(users::token.eq(token))
        .first::<User>(connection);

    match find {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn update_user_from_id(user_id: i32, user_update: NewUser) -> Option<User> {
    let connection = &mut create_connection();
    let update = diesel
        ::update(users::table)
        .filter(users::id.eq(user_id))
        .set(user_update)
        .get_result::<User>(connection);

    match update {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}
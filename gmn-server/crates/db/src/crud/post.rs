use diesel::{ query_dsl::methods::FilterDsl, ExpressionMethods, QueryResult, RunQueryDsl };
use gmn_db_schema::{ models::{ Post, NewPost }, schema::posts };

use crate::create_connection;

pub fn create_post(new_post: NewPost) -> Option<Post> {
    let connection = &mut create_connection();
    let insert = diesel
        ::insert_into(posts::table)
        .values(new_post)
        .get_result::<Post>(connection);

    match insert {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn get_post_from_id(posts_id: i32) -> Option<Post> {
    let connection = &mut create_connection();
    let find: QueryResult<Post> = posts::table
        .filter(posts::id.eq(posts_id))
        .first::<Post>(connection);

    match find {
        Ok(m) => { Some(m) }
        Err(_e) => { None }
    }
}

pub fn get_post_from_user_id(user_id: i32) -> Vec<Post> {
    let connection = &mut create_connection();
    let find = posts::table.filter(posts::user_id.eq(user_id)).load(connection);

    match find {
        Ok(m) => { m }
        Err(_e) => { vec![] }
    }
}

pub fn update_post_from_id(posts_id: i32, posts_update: NewPost) -> Option<Post> {
    let connection = &mut create_connection();
    let update = diesel
        ::update(posts::table)
        .filter(posts::id.eq(posts_id))
        .set(posts_update)
        .get_result::<Post>(connection);

    match update {
        Ok(m) => { Some(m) }
        Err(_e) => { None }
    }
}

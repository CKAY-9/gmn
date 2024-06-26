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

pub fn get_post_from_id(post_id: i32) -> Option<Post> {
    let connection = &mut create_connection();
    let find: QueryResult<Post> = posts::table
        .filter(posts::id.eq(post_id))
        .first::<Post>(connection);

    match find {
        Ok(p) => { Some(p) }
        Err(_e) => { None }
    }
}

pub fn get_posts_from_user_id(user_id: i32) -> Vec<Post> {
    let connection = &mut create_connection();
    let find = posts::table.filter(posts::user_id.eq(user_id)).load(connection);

    match find {
        Ok(p) => { p }
        Err(_e) => { vec![] }
    }
}

pub fn update_post_from_id(post_id: i32, posts_update: NewPost) -> Option<Post> {
    let connection = &mut create_connection();
    let update = diesel
        ::update(posts::table)
        .filter(posts::id.eq(post_id))
        .set(posts_update)
        .get_result::<Post>(connection);

    match update {
        Ok(p) => { Some(p) }
        Err(_e) => { None }
    }
}

pub fn delete_post_from_id(post_id: i32) -> Option<Post> {
    let connection = &mut create_connection();
    let update = diesel
        ::delete(posts::table)
        .filter(posts::id.eq(post_id))
        .get_result::<Post>(connection);

    match update {
        Ok(p) => { Some(p) }
        Err(_e) => { None }
    }
}

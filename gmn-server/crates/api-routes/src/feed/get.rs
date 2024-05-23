use actix_web::{get, http::StatusCode, web, HttpRequest, HttpResponse, Responder};
use diesel::{prelude::RunQueryDsl, query_dsl::methods::SelectDsl, SelectableHelper};
use gmn_db::{create_connection, crud::{post::get_post_from_id, user::get_user_from_token}};
use gmn_db_schema::{models::Post, schema::posts};
use gmn_utils::extract_header_value;
use crate::dto::Message;

use super::{dto::GetPostDTO, helpers::get_user_specific_feed_posts};

#[get("/explore")]
pub async fn get_explore_posts() -> Result<impl Responder, Box<dyn std::error::Error>> {
    let connection = &mut create_connection();
    let posts = posts::table
        .select(Post::as_select())
        .load(connection);

    match posts {
        Ok(ps) => {
            Ok(HttpResponse::Ok().json(ps))
        },
        Err(_e) => {
            let empty: Vec<usize> = vec![];
            Ok(HttpResponse::Ok().json(empty))
        }
    }
}

#[get("")]
pub async fn get_post(_request: HttpRequest, query: web::Query<GetPostDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let post_option = get_post_from_id(query.post_id);
    match post_option {
        Some(p) => {
            Ok(HttpResponse::Ok().json(p))
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get post".to_string()
            }))
        }
    }
}

#[get("")]
pub async fn get_feed_posts(request: HttpRequest) -> Result<impl Responder, Box<dyn std::error::Error>> {
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
    let feed = get_user_specific_feed_posts(&user);

    Ok(HttpResponse::Ok().json(feed))
}
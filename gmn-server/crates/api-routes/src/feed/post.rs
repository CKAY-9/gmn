use std::time::SystemTime;

use actix_web::{ http::StatusCode, post, web, HttpRequest, HttpResponse, Responder };
use gmn_db::crud::{post::{create_post, get_post_from_id, update_post_from_id}, user::get_user_from_token};
use gmn_db_schema::models::NewPost;
use gmn_utils::{extract_header_value, iso8601};

use crate::dto::Message;

use super::dto::{NewPostDTO, GetPostDTO};

#[post("")]
pub async fn new_post(
    request: HttpRequest,
    data: web::Json<NewPostDTO>
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

    // TODO: handle files
    let n_post = NewPost {
        title: data.title.clone(),
        description: data.description.clone(),
        date: iso8601(&SystemTime::now()),
        likes: vec![],
        files: data.files.clone(),
        user_id: user.id
    };
    let insert = create_post(n_post);
    match insert {
        Some(p) => Ok(HttpResponse::Ok().json(p)),
        None => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
            message: "Failed to create post".to_string()
        }))
    }
}

#[post("/like")]
pub async fn like_feed_post(request: HttpRequest, data: web::Json<GetPostDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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
    let post_option = get_post_from_id(data.post_id);
    if post_option.is_none() {
        return Ok(
            HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get post".to_string(),
            })
        );
    }

    let mut post = post_option.unwrap();
    let already_liked = post.likes.contains(&user.id);
    match already_liked {
        true => {
            // remove like
            for i in 0..post.likes.len() {
                let temp = post.likes.get(i);
                if temp.is_none() {
                    continue;
                }
                if temp.unwrap() == &user.id {
                    post.likes.remove(i);
                    break;
                }
            }
        },
        _ => {
            post.likes.push(user.id);
        }
    }

    let post_update = serde_json::from_str::<NewPost>(serde_json::to_string(&post).unwrap().as_str()).unwrap();
    let update = update_post_from_id(post.id, post_update);
    match update {
        Some(p) => Ok(HttpResponse::Ok().json(p)),
        None => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message {
            message: "Failed to update likes".to_string()
        }))
    }
}
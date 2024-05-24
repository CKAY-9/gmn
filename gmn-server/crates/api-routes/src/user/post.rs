use actix_web::{http::StatusCode, post, web, HttpRequest, HttpResponse, Responder};
use gmn_db::crud::user::{get_user_from_id, get_user_from_token, update_user_from_id};
use gmn_db_schema::models::NewUser;
use gmn_utils::extract_header_value;

use crate::dto::Message;

use super::dto::GetUserDTO;

#[post("/follow")]
pub async fn follow_or_unfollower_user(
    request: HttpRequest,
    data: web::Json<GetUserDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to get user token".to_string(),
            }));
    }

    let user_option = get_user_from_token(token_option.unwrap());
    if user_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get user".to_string(),
            }));
    }

    let mut user = user_option.unwrap();

    let profile_option = get_user_from_id(data.user_id);
    if profile_option.is_none() {
        return Ok(HttpResponse::Ok()
            .status(StatusCode::NOT_FOUND)
            .json(Message {
                message: "Failed to get user".to_string(),
            }));
    }

	let mut profile = profile_option.unwrap();

	match user.following.contains(&profile.id) {
		true => {
			// unfollow
			for i in 0..user.following.len() {
				if user.following.get(i).unwrap_or(&0) == &profile.id {
					user.following.remove(i);
				}
			}

			for i in 0..profile.followers.len() {
				if profile.followers.get(i).unwrap_or(&0) == &user.id {
					profile.followers.remove(i);
				}
			}

            let u_update = serde_json::from_str::<NewUser>(serde_json::to_string(&user).unwrap().as_str()).unwrap();
            let p_update = serde_json::from_str::<NewUser>(serde_json::to_string(&profile).unwrap().as_str()).unwrap();
            update_user_from_id(user.id, u_update);
            update_user_from_id(profile.id, p_update);

			Ok(HttpResponse::Ok().json(Message {
				message: "Followed".to_string()
			}))
		},
		false => {
			// follow
			user.following.push(profile.id);
			profile.followers.push(user.id);

            let u_update = serde_json::from_str::<NewUser>(serde_json::to_string(&user).unwrap().as_str()).unwrap();
            let p_update = serde_json::from_str::<NewUser>(serde_json::to_string(&profile).unwrap().as_str()).unwrap();
            update_user_from_id(user.id, u_update);
            update_user_from_id(profile.id, p_update);

			Ok(HttpResponse::Ok().json(Message {
				message: "Unfollowed".to_string()
			}))
		}
	}
}

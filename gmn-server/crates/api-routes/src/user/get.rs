use std::time::SystemTime;

use super::dto::{
    DiscordInitialDTO, DiscordUserDTO, UserActivity, GetUserDTO, GetUserOptionDTO, GithubInitialDTO, GithubUserDTO, UserOAuthDTO
};
use crate::dto::Message;
use actix_web::{
    get,
    http::StatusCode,
    web::{self, Redirect},
    HttpRequest, HttpResponse, Responder,
};
use gmn_db::crud::{post::get_posts_from_user_id, user::{
    create_user, get_user_from_id, get_user_from_oauth, get_user_from_token, update_user_from_id,
}, workout::get_workouts_from_user_id};
use gmn_db_schema::models::{NewUser, User};
use gmn_utils::{extract_header_value, get_env_var, get_local_api_url, iso8601};
use rand::Rng;
use sha2::{Digest, Sha256};

#[get("/discord")]
pub async fn login_with_discord(
    query: web::Query<UserOAuthDTO>,
) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let inital_response = client
        .post("https://discord.com/api/oauth2/token")
        .form(&[
            ("client_id", get_env_var("DISCORD_OAUTH_ID")),
            ("client_secret", get_env_var("DISCORD_OAUTH_SECRET")),
            ("code", query.code.to_string()),
            ("grant_type", "authorization_code".to_string()),
            ("redirect_uri", get_local_api_url() + "/user/auth/discord"),
        ])
        .header("Content-Type", "application/x-www-form-urlencoded")
        .send()
        .await?;
    let inital_response_parsed =
        serde_json::from_str::<DiscordInitialDTO>(inital_response.text().await?.as_str())?;
    let user_response = client
        .get("https://discord.com/api/v10/users/@me")
        .header(
            "authorization",
            format!("Bearer {}", inital_response_parsed.access_token),
        )
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(
            Redirect::to(format!("{}/login?msg=ue", get_env_var("FRONTEND_URL"))).permanent(),
        );
    }

    let user_response_parsed: DiscordUserDTO =
        serde_json::from_str::<DiscordUserDTO>(user_response.text().await?.as_str())?;

    let oauth: String = format!("discord-{}", user_response_parsed.id).to_string();
    let user_option: Option<User> = get_user_from_oauth(oauth.clone());
    // Check if a user already exists with OAuth provider
    if user_option.is_some() {
        let mut user = user_option.unwrap();
        user.avatar = format!(
            "https://cdn.discordapp.com/avatars/{}/{}",
            user_response_parsed.id, user_response_parsed.avatar
        );
        user.username = user_response_parsed.global_name;
        let update: NewUser =
            serde_json::from_str(serde_json::to_string(&user).unwrap().as_str()).unwrap();
        let _ = update_user_from_id(user.id, update);

        return Ok(Redirect::to(format!(
            "{}/login?token={}",
            get_env_var("FRONTEND_URL"),
            user.token
        )));
    }

    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 2_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        username: user_response_parsed.global_name,
        oauth_id: oauth,
        avatar: format!(
            "https://cdn.discordapp.com/avatars/{}/{}",
            user_response_parsed.id, user_response_parsed.avatar
        ),
        token: user_token.clone(),
        bio: "No bio provided.".to_string(),
        date: iso8601(&SystemTime::now()),
        usergroups: vec![],
        personal_records: vec![],
        followers: vec![],
        following: vec![],
    };
    let _insert: Option<User> = create_user(new_user);
    Ok(Redirect::to(format!(
        "{}/login?token={}",
        get_env_var("FRONTEND_URL"),
        user_token
    ))
    .permanent())
}

#[get("/github")]
pub async fn login_with_github(
    query: web::Query<UserOAuthDTO>,
) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let initial_token_response = client
        .post("https://github.com/login/oauth/access_token")
        .form(&[
            ("code", query.code.to_owned()),
            ("client_id", get_env_var("GITHUB_OAUTH_ID")),
            ("client_secret", get_env_var("GITHUB_OAUTH_SECRET")),
        ])
        .header("accept", "application/json")
        .send()
        .await?;
    let initial_response_parsed: GithubInitialDTO =
        serde_json::from_str::<GithubInitialDTO>(initial_token_response.text().await?.as_str())?;
    let user_response = client
        .get("https://api.github.com/user")
        .header(
            "authorization",
            format!(
                "{} {}",
                initial_response_parsed.token_type, initial_response_parsed.access_token
            ),
        )
        .header("accept", "application/vnd.github+json")
        .header("user-agent", "request")
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(Redirect::to(format!(
            "{}/login?msg=ue",
            get_env_var("FRONTEND_URL")
        ))
        .permanent());
    }
    let user_response_parsed: GithubUserDTO =
        serde_json::from_str::<GithubUserDTO>(user_response.text().await?.as_str())?;
    let oauth = format!("github-{}", user_response_parsed.id);
    let user: Option<User> = get_user_from_oauth(oauth.clone());

    if user.is_some() {
        let mut user_unwrap = user.unwrap();
        user_unwrap.avatar = user_response_parsed.avatar_url.clone();
        user_unwrap.username = user_response_parsed.login;
        let update: NewUser =
            serde_json::from_str(serde_json::to_string(&user_unwrap).unwrap().as_str()).unwrap();
        let _ = update_user_from_id(user_unwrap.id, update);

        return Ok(Redirect::to(format!(
            "{}/login?token={}",
            get_env_var("FRONTEND_URL"),
            user_unwrap.token
        )));
    }

    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 2_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        username: user_response_parsed.login.clone(),
        oauth_id: oauth,
        avatar: user_response_parsed.avatar_url.clone(),
        token: user_token.clone(),
        bio: "No bio provided.".to_string(),
        date: iso8601(&SystemTime::now()),
        usergroups: vec![],
        personal_records: vec![],
        followers: vec![],
        following: vec![],
    };
    let _insert = create_user(new_user);
    Ok(Redirect::to(format!(
        "{}/login?token={}",
        get_env_var("FRONTEND_URL"),
        user_token
    )))
}

#[get("")]
pub async fn get_user(
    request: HttpRequest,
    query: web::Query<GetUserOptionDTO>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let id: Option<i32> = query.user_id;
    match id {
        Some(user_id) => {
            // Get user from id
            let user_option = get_user_from_id(user_id);
            if user_option.is_none() {
                return Ok(HttpResponse::Ok()
                    .status(StatusCode::BAD_REQUEST)
                    .json(Message {
                        message: "Failed to get user".to_string(),
                    }));
            }

            Ok(HttpResponse::Ok().json(user_option.unwrap()))
        }
        None => {
            // Get user from token
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

            Ok(HttpResponse::Ok().json(user_option.unwrap()))
        }
    }
}

#[get("/activity")]
pub async fn get_user_activity(query: web::Query<GetUserDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user_option = get_user_from_id(query.user_id);
    if user_option.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
            message: "Failed to get user".to_string()
        }));
    }

    let user = user_option.unwrap();
    let all_posts = get_posts_from_user_id(user.id);
    let all_workouts = get_workouts_from_user_id(user.id);
    
    // TODO: maybe add likes?

    Ok(HttpResponse::Ok().json(UserActivity {
        posts: all_posts,
        workouts: all_workouts
    }))
}

use serde::Deserialize;

#[derive(Deserialize)]
pub struct UserOAuthDTO {
    pub code: String
}

#[derive(Deserialize, Debug)]
pub struct DiscordInitialDTO {
    pub token_type: String,
    pub access_token: String,
}

#[derive(Deserialize)]
pub struct DiscordUserDTO {
    pub global_name: String,
    pub avatar: String,
    pub id: String,
}

#[derive(Deserialize)]
pub struct GetUserOptionDTO {
    pub user_id: Option<i32>
}

#[derive(Deserialize, Debug)]
pub struct GetUserDTO {
    pub user_id: i32
}

#[derive(Deserialize)]
pub struct UpdateRecordsDTO {
    pub bench: i32,
    pub squat: i32,
    pub deadlift: i32
}

#[derive(Deserialize)]
pub struct UpdateUserDTO {
    pub bio: String
}

#[derive(Deserialize)]
pub struct GithubInitialDTO {
    pub access_token: String,
    pub token_type: String,
    pub scope: String,
}

#[derive(Deserialize)]
pub struct GithubUserDTO {
    pub login: String,
    pub avatar_url: String,
    pub id: u64,
}

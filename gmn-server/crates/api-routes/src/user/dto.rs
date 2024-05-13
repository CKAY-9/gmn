use serde::Deserialize;

#[derive(Deserialize)]
pub struct UserOAuthDTO {
    pub code: String
}

#[derive(Deserialize)]
pub struct DiscordInitialDTO {
    pub access_token: String,
    pub token_type: String,
}

#[derive(Deserialize)]
pub struct DiscordUserDTO {
    pub global_name: String,
    pub avatar: String,
    pub id: String,
}

#[derive(Deserialize)]
pub struct GetUserDTO {
    pub user_id: Option<i32>
}
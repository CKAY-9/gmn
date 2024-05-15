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
pub struct GetUserDTO {
    pub user_id: Option<i32>
}
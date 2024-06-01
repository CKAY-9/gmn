use serde::Deserialize;

#[derive(Deserialize)]
pub struct NewPostDTO {
    pub title: String,
    pub description: String,
    pub files: Vec<String>
}

#[derive(Deserialize)]
pub struct UpdatePostDTO {
    pub post_id: i32,
    pub title: String,
    pub description: String,
}


#[derive(Deserialize)]
pub struct GetPostDTO {
    pub post_id: i32
}
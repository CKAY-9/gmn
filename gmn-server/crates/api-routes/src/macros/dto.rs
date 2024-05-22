use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GetMacrosDTO {
  pub user_id: i32,
  pub date: String
}

#[derive(Deserialize)]
pub struct UpdateEntriesDTO {
  pub macro_id: i32,
  pub entries: Vec<String>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EntriesDTO {
  pub name: String,
  pub calories: String,
  pub protein: String,
  pub fats: String,
  pub carbs: String,
}
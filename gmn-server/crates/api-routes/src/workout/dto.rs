use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GetWorkoutsDTO {
  pub user_id: i32,
  pub date: String
}

#[derive(Deserialize)]
pub struct UpdateEntriesDTO {
  pub workout_id: i32,
  pub exercises: Vec<String>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EntriesDTO {
  pub exercise_id: i32,
  pub weight: i32,
  pub reps: i32,
  pub sets: i32
}
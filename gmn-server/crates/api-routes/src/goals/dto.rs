use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UpdateGoalsDTO {
  pub goal_id: i32,
  pub weight: i32,
  pub height: i32,
  pub calorie_goal: i32,
  pub weight_goal: i32,
  pub activity_goal: i32
}
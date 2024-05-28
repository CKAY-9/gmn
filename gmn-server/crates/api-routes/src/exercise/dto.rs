use serde::Deserialize;

#[derive(Deserialize)]
pub struct GetExerciseDTO {
    pub exercise_id: i32,
}

use gmn_db_schema::models::Workout;

use crate::workout::dto::EntriesDTO;

pub fn get_total_activity_level(workout: Workout) -> i32 {
    let mut t = 0;
    for exercise in workout.exercises.iter() {
        let parse_option = serde_json::from_str::<EntriesDTO>(&exercise);
        if parse_option.is_err() { continue; }

        let parsed = parse_option.unwrap();
        t += parsed.reps * parsed.sets;
    }

    let activity = t / (240 / 6);
    match activity > 5 {
        true => 5,
        false => activity
    }
}
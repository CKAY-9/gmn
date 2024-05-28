use gmn_db::crud::workout::create_workout;
use std::time::SystemTime;
use gmn_db_schema::models::{ Workout, NewWorkout };
use gmn_utils::iso8601;

pub fn get_workouts_from_date(user_id: i32, workouts: Vec<Workout>, date: String) -> Workout {
    for m in workouts {
        let temp_date = m.date;
        let date_to_iso = iso8601::date(&temp_date);
        match date_to_iso {
            Ok(d) => {
                if d.to_string() == date {
                    return Workout {
                        id: m.id,
                        user_id: m.user_id,
                        date: iso8601(&SystemTime::now()),
                        title: m.title.clone(),
                        description: m.description.clone(),
                        exercises: m.exercises,
                    };
                }
            }
            _ => {
                continue;
            }
        }
    }

    let new_workouts = NewWorkout {
        user_id,
        date: iso8601(&SystemTime::now()),
        title: "".to_string(),
        description: "".to_string(),
        exercises: vec![]
    };
    let insert = create_workout(new_workouts);
    match insert {
        Some(m) => m,
        None =>
            Workout {
                id: 0,
                user_id,
                date: iso8601(&SystemTime::now()),
                title: "".to_string(),
                description: "".to_string(),
                exercises: vec![]
            },
    }
}

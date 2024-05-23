use gmn_db::crud::macros::create_macros;
use std::time::SystemTime;
use gmn_db_schema::models::{ Macros, NewMacros };
use gmn_utils::iso8601;

pub fn get_macros_from_date(user_id: i32, macros: Vec<Macros>, date: String) -> Macros {
    for m in macros {
        let temp_date = m.date;
        let date_to_iso = iso8601::date(&temp_date);
        match date_to_iso {
            Ok(d) => {
                if d.to_string() == date {
                    return Macros {
                        id: m.id,
                        user_id: m.user_id,
                        date: iso8601(&SystemTime::now()),
                        calories: m.calories,
                        protein: m.protein,
                        carbs: m.carbs,
                        fats: m.fats,
                        entries: m.entries,
                    };
                }
            }
            _ => {
                continue;
            }
        }
    }

    let new_macros = NewMacros {
        user_id,
        date: iso8601(&SystemTime::now()),
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        entries: vec![],
    };
    let insert = create_macros(new_macros);
    match insert {
        Some(m) => m,
        None =>
            Macros {
                id: 0,
                user_id,
                date: iso8601(&SystemTime::now()),
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                entries: vec![],
            },
    }
}

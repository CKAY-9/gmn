use diesel::{deserialize::Queryable, prelude::Insertable, query_builder::AsChangeset, Selectable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub token: String,
    pub oauth_id: String,
    pub username: String,
    pub avatar: String,
    pub bio: String,
    pub date: String,
    pub personal_records: Vec<i32>,
    pub usergroups: Vec<i32>,
    pub followers: Vec<i32>,
    pub following: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub token: String,
    pub oauth_id: String,
    pub username: String,
    pub avatar: String,
    pub bio: String,
    pub date: String,
    pub personal_records: Vec<i32>,
    pub usergroups: Vec<i32>,
    pub followers: Vec<i32>,
    pub following: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::usergroups)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Usergroup {
    pub id: i32,
    pub name: String,
    pub color: String,
    pub permission: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::usergroups)]
pub struct NewUsergroup {
    pub name: String,
    pub color: String,
    pub permission: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::workouts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Workout {
    pub id: i32,
    pub user_id: i32,
    pub date: String,
    pub title: String,
    pub description: String,
    pub exercises: Vec<String>,
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::workouts)]
pub struct NewWorkout {
    pub user_id: i32,
    pub date: String,
    pub title: String,
    pub description: String,
    pub exercises: Vec<String>,
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::exercises)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Exercise {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub example_video: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::exercises)]
pub struct NewExercise {
    pub name: String,
    pub description: String,
    pub example_video: String,
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::macros)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Macros {
    pub id: i32,
    pub user_id: i32,
    pub date: String,
    pub calories: i32,
    pub protein: i32,
    pub carbs: i32,
    pub fats: i32,
    pub entries: Vec<String>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Clone, Debug)]
#[diesel(table_name = crate::schema::macros)]
pub struct NewMacros {
    pub user_id: i32,
    pub date: String,
    pub calories: i32,
    pub protein: i32,
    pub carbs: i32,
    pub fats: i32,
    pub entries: Vec<String>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub date: String,
    pub likes: Vec<i32>,
    pub files: Vec<String>,
    pub user_id: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Clone)]
#[diesel(table_name = crate::schema::posts)]
pub struct NewPost {
    pub title: String,
    pub description: String,
    pub date: String,
    pub likes: Vec<i32>,
    pub files: Vec<String>,
    pub user_id: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::personal_goals)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct PersonalGoal {
    pub id: i32,
    pub user_id: i32,
    pub height: i32,
    pub weight: i32,
    pub activity_level: i32,
    pub calorie_goal: i32,
    pub weight_goal: i32,
    pub activity_goal: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Clone)]
#[diesel(table_name = crate::schema::personal_goals)]
pub struct NewPersonalGoal {
    pub user_id: i32,
    pub height: i32,
    pub weight: i32,
    pub activity_level: i32,
    pub calorie_goal: i32,
    pub weight_goal: i32,
    pub activity_goal: i32
}
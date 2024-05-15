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
    pub personal_records: Vec<i32>,
    pub journal_entries: Vec<i32>,
    pub usergroups: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub token: String,
    pub oauth_id: String,
    pub username: String,
    pub avatar: String,
    pub bio: String,
    pub personal_records: Vec<i32>,
    pub journal_entries: Vec<i32>,
    pub usergroups: Vec<i32>
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
#[diesel(table_name = crate::schema::journals)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Journal {
    pub id: i32,
    pub user_id: i32,
    pub posted: String,
    pub exercises: Vec<String>,
    pub description: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::journals)]
pub struct NewJournal {
    pub user_id: i32,
    pub posted: String,
    pub exercises: Vec<String>,
    pub description: String
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::exercises)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Exercise {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub example_video: String,
    pub journal_entries: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::exercises)]
pub struct NewExercise {
    pub name: String,
    pub description: String,
    pub example_video: String,
    pub journal_entries: Vec<i32>
}
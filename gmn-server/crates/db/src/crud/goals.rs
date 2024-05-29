use diesel::{ query_dsl::methods::FilterDsl, ExpressionMethods, QueryResult, RunQueryDsl };
use gmn_db_schema::{ models::{ PersonalGoal, NewPersonalGoal }, schema::personal_goals };

use crate::create_connection;

pub fn create_personal_goal(new_personal_goal: NewPersonalGoal) -> Option<PersonalGoal> {
    let connection = &mut create_connection();
    let insert = diesel
        ::insert_into(personal_goals::table)
        .values(new_personal_goal)
        .get_result::<PersonalGoal>(connection);

    match insert {
        Ok(u) => { Some(u) }
        Err(_e) => { None }
    }
}

pub fn get_personal_goal_from_id(personal_goal_id: i32) -> Option<PersonalGoal> {
    let connection = &mut create_connection();
    let find: QueryResult<PersonalGoal> = personal_goals::table
        .filter(personal_goals::id.eq(personal_goal_id))
        .first::<PersonalGoal>(connection);

    match find {
        Ok(m) => { Some(m) }
        Err(_e) => { None }
    }
}

pub fn get_personal_goal_from_user_id(user_id: i32) -> Option<PersonalGoal> {
    let connection = &mut create_connection();
    let find: QueryResult<PersonalGoal> = personal_goals::table
        .filter(personal_goals::user_id.eq(user_id))
        .first::<PersonalGoal>(connection);

    match find {
        Ok(m) => { Some(m) }
        Err(_e) => { None }
    }
}

pub fn update_personal_goal_from_id(
    personal_goals_id: i32,
    personal_goals_update: NewPersonalGoal
) -> Option<PersonalGoal> {
    let connection = &mut create_connection();
    let update = diesel
        ::update(personal_goals::table)
        .filter(personal_goals::id.eq(personal_goals_id))
        .set(personal_goals_update)
        .get_result::<PersonalGoal>(connection);

    match update {
        Ok(m) => { Some(m) }
        Err(_e) => { None }
    }
}

// @generated automatically by Diesel CLI.

diesel::table! {
    exercises (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        example_video -> Text,
    }
}

diesel::table! {
    macros (id) {
        id -> Int4,
        user_id -> Int4,
        date -> Text,
        calories -> Int4,
        protein -> Int4,
        carbs -> Int4,
        fats -> Int4,
        entries -> Array<Text>,
    }
}

diesel::table! {
    posts (id) {
        id -> Int4,
        title -> Text,
        description -> Text,
        date -> Text,
        likes -> Array<Int4>,
        files -> Array<Text>,
        user_id -> Int4,
    }
}

diesel::table! {
    usergroups (id) {
        id -> Int4,
        name -> Text,
        color -> Text,
        permission -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        token -> Text,
        oauth_id -> Text,
        username -> Text,
        avatar -> Text,
        bio -> Text,
        date -> Text,
        personal_records -> Array<Int4>,
        usergroups -> Array<Int4>,
        followers -> Array<Int4>,
        following -> Array<Int4>,
    }
}

diesel::table! {
    workouts (id) {
        id -> Int4,
        user_id -> Int4,
        date -> Text,
        title -> Text,
        description -> Text,
        exercises -> Array<Text>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    exercises,
    macros,
    posts,
    usergroups,
    users,
    workouts,
);

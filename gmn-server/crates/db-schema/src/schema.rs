// @generated automatically by Diesel CLI.

diesel::table! {
    exercises (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        example_video -> Text,
        journal_entries -> Array<Int4>,
    }
}

diesel::table! {
    journals (id) {
        id -> Int4,
        user_id -> Int4,
        posted -> Text,
        exercises -> Array<Text>,
        description -> Text,
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
        personal_records -> Array<Int4>,
        journal_entries -> Array<Int4>,
        usergroups -> Array<Int4>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    exercises,
    journals,
    usergroups,
    users,
);

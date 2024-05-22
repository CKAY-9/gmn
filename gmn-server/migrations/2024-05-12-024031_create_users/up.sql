CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    token TEXT NOT NULL,
    oauth_id TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT NOT NULL,
    bio TEXT NOT NULL,
    date TEXT NOT NULL,
    personal_records INTEGER[] NOT NULL,
    usergroups INTEGER[] NOT NULL,
    followers INTEGER[] NOT NULL,
    following INTEGER[] NOT NULL
);
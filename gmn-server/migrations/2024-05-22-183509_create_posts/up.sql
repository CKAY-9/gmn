CREATE TABLE posts (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    likes INTEGER[] NOT NULL,
    files TEXT[] NOT NULL,
    user_id INTEGER NOT NULL
);
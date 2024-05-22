CREATE TABLE workouts (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    exercises TEXT[] NOT NULL
);
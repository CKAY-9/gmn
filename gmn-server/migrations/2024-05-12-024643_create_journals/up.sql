CREATE TABLE journals (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    posted TEXT NOT NULL,
    exercises TEXT[] NOT NULL,
    description TEXT NOT NULL
);
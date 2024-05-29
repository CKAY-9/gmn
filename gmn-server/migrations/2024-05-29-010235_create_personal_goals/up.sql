CREATE TABLE personal_goals (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  activity_level INTEGER NOT NULL,
  calorie_goal INTEGER NOT NULL,
  weight_goal INTEGER NOT NULL,
  activity_goal INTEGER NOT NULL
);
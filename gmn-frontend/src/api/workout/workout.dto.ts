export interface WorkoutDTO {
  id: number,
  user_id: number,
  date: string,
  title: string,
  description: string,
  exercises: string[]
}

export interface WorkoutExerciseDTO {
  exercise_id: number,
  weight: number,
  reps: number,
  sets: number
}
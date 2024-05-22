export interface MacrosDTO {
  id: number,
  user_id: number,
  date: string,
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  entries: any[]
}

export interface EntriesDTO {
  name: string,
  calories: number,
  protein: number
  carbs: number,
  fats: number
}
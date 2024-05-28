import axios from "axios";
import { API_URL } from "../resources";
import { WorkoutDTO } from "./workout.dto";
import { getCookie } from "@/utils/cookies";

export const getWorkoutsFromUserID = async (user_id: number, date?: string): Promise<WorkoutDTO | null> => {
  const date_string = date === undefined ? "" : date;
  try {
    const request = await axios({
      url: API_URL + "/workout",
      method: "GET",
      params: {
        user_id,
        date: date_string
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const updateWorkoutEntriesFromWorkoutID = async (workout_id: number, entries: string[]): Promise<WorkoutDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/workout/entries",
      method: "PUT",
      headers: {
        Authorization: getCookie("token") || ""
      }, 
      data: {
        workout_id,
        exercises: entries
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}
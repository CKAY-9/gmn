import axios from "axios";
import { ExerciseDTO } from "./exercise.dto";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";

export const createNewExercise = async (
  name: string, 
  description: string, 
  example_video: string
): Promise<ExerciseDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/exercise",
      method: "POST",
      data: {
        name,
        description,
        example_video
      },
      headers: {
        Authorization: getCookie("token") || ""
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const getExerciseFromID = async (
  id: number
): Promise<ExerciseDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/exercise",
      method: "GET",
      params: {
        exercise_id: Number.parseInt(id.toString())
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const getAllExercises = async (): Promise<ExerciseDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/exercise/all",
      method: "GET",
    });
    return request.data;
  } catch (ex) {
    return [];
  }
}

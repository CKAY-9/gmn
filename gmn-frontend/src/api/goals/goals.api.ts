import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { PersonalGoalDTO } from "./goals.dto";

export const getPersonalGoals = async (
	user_id?: number
): Promise<PersonalGoalDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/goals",
			method: "GET",
			params: {
				user_id: user_id,
			},
			headers: {
				Authorization: getCookie("token") || "",
			},
		});
		return request.data;
	} catch (ex) {
		return null;
	}
};

export const updatePersonalGoalsFromID = async (
	goal_id: number,
	height: number,
	weight: number,
	calorie_goal: number,
	weight_goal: number,
	activity_goal: number
): Promise<PersonalGoalDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/goals",
			method: "PUT",
			data: {
				goal_id,
				weight,
				height,
				calorie_goal,
				weight_goal,
				activity_goal
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
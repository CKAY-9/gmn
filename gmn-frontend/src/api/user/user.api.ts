import axios from "axios";
import { API_URL } from "../resources";
import { UserActivityDTO, UserDTO } from "./user.dto";
import { getCookie } from "@/utils/cookies";

export const getUserFromID = async (
	user_id: number,
	token?: string
): Promise<UserDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/user",
			method: "GET",
			params: {
				user_id: user_id,
			},
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch (ex) {
		return null;
	}
};

export const getUserFromToken = async (
	token: string
): Promise<UserDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/user",
			method: "GET",
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch (ex) {
		return null;
	}
};

export const updatePersonalRecordsFromID = async (user_id: number, bench: number, squat: number, deadlift: number): Promise<UserDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/user/prs",
			method: "PUT",
			headers: {
				Authorization: getCookie("token") || ""
			},
			data: {
				bench: Number.parseInt(bench.toString()),
				squat: Number.parseInt(squat.toString()),
				deadlift: Number.parseInt(deadlift.toString())
			}
		});
		return request.data;
	} catch (ex) {
		return null;
	}
}

export const updateUserFromID = async (user_id: number, bio: string): Promise<UserDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/user",
			method: "PUT",
			headers: {
				Authorization: getCookie("token") || ""
			},
			data: {
				bio
			}
		});
		return request.data;
	} catch (ex) {
		return null;
	}
}

export const followUserFromID = async (profile_id: number): Promise<boolean> => {
	try {
		const request = await axios({
			url: API_URL + "/user/follow",
			method: "POST",
			data: {
				user_id: profile_id
			},
			headers: {
				Authorization: getCookie("token") || ""
			}
		});
		return true;
	} catch (ex) {
		console.log(ex);
		return false;
	}
}

export const getUserActivity = async (user_id: number): Promise<UserActivityDTO> => {
	try {
		const request = await axios({
			url: API_URL + "/user/activity",
			method: "GET",
			params: {
				user_id
			}
		});
		return request.data;
	} catch (ex) {
		return {
			posts: [],
			workouts: []
		}
	}
}
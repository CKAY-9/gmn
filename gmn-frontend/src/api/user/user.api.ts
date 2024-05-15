import axios from "axios";
import { API_URL } from "../resources";
import { UserDTO } from "./user.dto";

export const getUserFromID = async (
	user_id: number,
	token?: string
): Promise<UserDTO | null> => {
	try {
		const request = await axios({
			url: API_URL + "/users",
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
			url: API_URL + "/users",
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
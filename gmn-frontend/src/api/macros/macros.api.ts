import axios from "axios";
import { API_URL } from "../resources";
import { MacrosDTO } from "./macros.dto";
import { getCookie } from "@/utils/cookies";

export const getMacrosFromUserID = async (user_id: number, date?: string): Promise<MacrosDTO | null> => {
  const date_string = date === undefined ? "" : date;
  try {
    const request = await axios({
      url: API_URL + "/macros",
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

export const updateMacroEntriesFromMacroID = async (macro_id: number, entries: string[]): Promise<MacrosDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/macros/entries",
      method: "PUT",
      headers: {
        Authorization: getCookie("token") || ""
      }, 
      data: {
        macro_id,
        entries
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}
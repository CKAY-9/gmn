import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { PostDTO } from "./feed.dto";

export const getExplorePosts = async (): Promise<PostDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/explore",
      method: "GET",
    });
    return request.data;
  } catch (ex) {
    return [];
  }
};

export const getFeedPosts = async (): Promise<PostDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/feed",
      method: "GET",
      headers: {
        Authorization: getCookie("token") || "",
      },
    });
    return request.data;
  } catch (ex) {
    return [];
  }
};

export const getFeedPostsFromUserID = async (user_id: number): Promise<PostDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post/user",
      method: "GET",
      params: {
        user_id
      }
    });
    return request.data;
  } catch (ex) {
    return [];
  }
}

export const getFeedPostsFromID = async (post_id: number): Promise<PostDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post",
      method: "GET",
      params: {
        post_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const likeFeedPostFromID = async (post_id: number): Promise<PostDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post/like",
      method: "POST",
      data: {
        post_id
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

export const deleteFeedPostFromID = async (post_id: number): Promise<boolean> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post",
      method: "DELETE",
      data: {
        post_id
      },
      headers: {
        Authorization: getCookie("token") || "",
      },
    });
    return true;
  } catch (ex) {
    return false;
  }
};

export const createNewFeedPost = async (
  title: string,
  description: string,
  files: File[]
): Promise<PostDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post",
      method: "POST",
      data: {
        title: title,
        description: description,
        files: files,
      },
      headers: {
        Authorization: getCookie("token") || "",
      },
    });
    return request.data;
  } catch (ex) {
    console.log(ex);
    return null;
  }
};

export const updateFeedPostFromID = async (
  post_id: number,
  title: string,
  description: string
): Promise<PostDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/feed/post",
      method: "PUT",
      data: {
        post_id,
        title,
        description
      },
      headers: {
        Authorization: getCookie("token") || "",
      },
    });
    return request.data;
  } catch (ex) {
    console.log(ex);
    return null;
  }
};

import { PostDTO } from "../feed/feed.dto"
import { WorkoutDTO } from "../workout/workout.dto"

export interface UserDTO {
    id: number,
    token: string,
    oauth_id: string,
    username: string,
    avatar: string,
    bio: string,
    date: string,
    personal_records: number[],
    usergroups: number[],
    followers: number[],
    following: number[]
}

export interface UserActivityDTO {
    posts: PostDTO[],
    workouts: WorkoutDTO[]
}
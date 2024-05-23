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
export interface UserDTO {
    id: number,
    token: string,
    oauth_id: string,
    username: string,
    avatar: string,
    bio: string,
    personal_records: number[],
    journal_entries: number[],
    usergroups: number[]
}
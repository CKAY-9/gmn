export interface PostDTO {
	id: number,
	title: string,
	description: string,
	date: string,
	files: string[],
	user_id: number
}
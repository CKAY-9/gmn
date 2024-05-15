export const API_URL = process.env.NEXT_PUBLIC_API_URL === undefined ? "http://127.0.0.1:3001/api/v1" : process.env.NEXT_PUBLIC_API_URL + "/api/v1";
export const DISCORD_OAUTH_LINK = process.env.NEXT_PUBLIC_DISCORD_OAUTH_LINK;
export const GITHUB_OAUTH_LINK = process.env.NEXT_PUBLIC_GITHUB_OAUTH_LINK;
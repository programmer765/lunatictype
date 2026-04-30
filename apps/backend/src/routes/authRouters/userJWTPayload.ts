interface UserJWTPayload {
    id: number;
    email: string;
    username: string;
    name?: string;
    picture?: string;
    google_id?: string;
    github_id?: string;
}

export default UserJWTPayload;

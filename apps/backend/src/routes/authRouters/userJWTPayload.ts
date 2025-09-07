interface UserJWTPayload {
    id: string;
    email: string;
    username: string;
    name?: string;
    picture?: string;
}

export default UserJWTPayload;

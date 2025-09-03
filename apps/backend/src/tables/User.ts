import z from "zod";

const User = {
    id: z.number(),
    google_id: z.number(),
    github_id: z.number(),
    username: z.string(),
    email: z.string().email(),
    name: z.string().min(2).max(100),
    password: z.string(),
    is_google_verified: z.boolean().default(false),
    is_github_verified: z.boolean().default(false),
    won: z.number().default(0),
    loss: z.number().default(0),
    tied: z.number().default(0),
    created_at: z.number().default(Date.now()),
    updated_at: z.number().default(Date.now()),
}

export default User;
import client from "../prisma/client";
import argon2 from "argon2";


const userDb = {
    findByGoogleId: async (google_id: number) => {
        try {
            return await client.user.findUnique({
                where: { google_id: google_id }
            });
        } catch (error: any) {
            console.error("Error finding user by Google ID:", error.message);
            throw new Error("Failed to find user by Google ID");
        }
    },

    findByGithubId: async (github_id: number) => {
        try {
            return await client.user.findUnique({
                where: { github_id: github_id }
            });
        } catch (error: any) {
            console.error("Error finding user by GitHub ID:", error.message);
            throw new Error("Failed to find user by GitHub ID");
        }
    },

    findByEmail: async (email: string) => {
        try {
            return await client.user.findUnique({
                where: { email: email }
            });
        } catch (error: any) {
            console.error("Error finding user by email:", error.message);
            throw new Error("Failed to find user by email");
        }
    },

    createUser: async (userData: {
        email: string;
        name?: string;
        username: string;
        password?: string;
        picture?: string;
        is_google_verified?: boolean;
        is_github_verified?: boolean;
        google_id?: number;
        github_id?: number;
    }) => {
        try {
            const passwordHash = userData.password ? await argon2.hash(userData.password) : undefined;
            if (userData.password) {
                userData.password = passwordHash;
            }
            return await client.user.create({
                data: userData,
                select: {
                    id: true,
                }
            });

        } catch (error: any) {
            if(error.code === 'P2002') {
                throw new Error("User with this email already exists");
            }
            if(error.code === 'P2002' || error.code === 'P2003') {
                throw new Error("Invalid user data");
            }
            console.log("Error creating user:", error.message);
            throw new Error("Failed to create user");
        }
    },

    verifyPassword: async (hashedPassword: string, plainPassword: string) => {
        try {
            return await argon2.verify(hashedPassword, plainPassword);
        } catch (error: any) {
            console.error("Error verifying password:", error.message);
            throw new Error("Failed to verify password");
        }
    }
}

export default userDb;
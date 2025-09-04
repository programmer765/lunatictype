import { publicProcedure, router } from "../../trpc";
import { jwt_secret, jwt_expiry, node_env, github_client_id, redirect_uri, github_auth_uri, github_client_secret, github_token_uri, github_profile_uri } from "../../env";
import z from 'zod';
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"
import UserJWTPayload from "./userJWTPayload";
import { PrismaClient } from "@prisma/client";


const client = new PrismaClient();

interface GithubIdTokenPayload {
    id: number;
    email: string;
    name: string;
    login: string;
    avatar_url: string;
}

interface GithubTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
}

interface StatePayload {
    from: string
    method: string
}


const github = router({
    link: publicProcedure.input( z.object({ redirect_url: z.string().url(), state: z.string() }) ).mutation(({ input }) => {
        const { redirect_url, state } = input;
        const url = `${github_auth_uri}?client_id=${github_client_id}&redirect_uri=${redirect_url}&state=${state}`;
        return { url };
    }),
    token: publicProcedure.input(z.object({ code: z.string(), state: z.string() })).mutation( async ({ input, ctx }) => {
        try {
            const { code, state } = input;

            const decodedState : StatePayload = JSON.parse(decodeURIComponent(state));

            const { data } : { data: GithubTokenResponse } = await axios.post(github_token_uri, {
                code: code,
                client_id: github_client_id,
                client_secret: github_client_secret,
                redirect_uri: redirect_uri,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            });

            const { access_token } = data;

            if(access_token === null || access_token === undefined || access_token === "") {
                return { success: false, message: "Invalid GitHub access token" };
            }

            const { data : profile } : { data: GithubIdTokenPayload } = await axios.get(github_profile_uri, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const user: UserJWTPayload = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                username: profile.login,
                picture: profile.avatar_url,
            };

            if(decodedState.from === "login") {
                const User = await client.user.findFirst({
                    where: {
                        email: user.email,
                        github_id: user.id,
                        is_github_verified: true,
                    }
                })

                if(User === null) {
                    return { success: false, message: 'User not found' };
                }
            }
            else if(decodedState.from === "signup") {
                await client.user.create({
                    data: {
                        email: user.email,
                        github_id: user.id,
                        picture: user.picture,
                        is_github_verified: true,
                        username: user.name,

                    }
                })
            }
            else {
                return { success: false, message: 'Invalid state' };
            }
            
            const userInfoToken = (jwt as any).sign(user, jwt_secret, { expiresIn: jwt_expiry });

            ctx.res.cookie("userInfoToken", userInfoToken, {
                httpOnly: true,
                secure: node_env === "production",
                sameSite: node_env === "production" ? "strict" : "lax",
                maxAge: jwt_expiry * 1000 // 1 hour
            });

            return { success: true }

        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                    (typeof error === "object" && error !== null && "response" in error && (error as any).response?.data)
                        || (error instanceof Error ? error.message : "An unknown error occurred"),
            });
        }
    })
});

export default github;
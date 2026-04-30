import { publicProcedure, router } from "../../trpc";
import { jwt_secret, jwt_expiry, node_env, github_client_id, redirect_uri, github_auth_uri, github_client_secret, github_token_uri, github_profile_uri } from "../../env";
import z from 'zod';
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"
import UserJWTPayload from "./userJWTPayload";
import userDb from "../../db/user";

interface GithubIdTokenPayload {
    id: string;
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
            console.log('github token');
            const { code, state } = input;

            const decodedState : StatePayload = JSON.parse(decodeURIComponent(state));
            
            if(decodedState.from !== "signup" && decodedState.from !== "login") {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid state' });
            }

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
            profile.id = String(profile.id)
            const User = await userDb.findByGithubId(profile.id);

            if(decodedState.from === "login" && User === null) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found, please sign up first' });
            }

            const user: UserJWTPayload = {
                id: User ? User.id : -1,
                email: profile.email,
                name: profile.name,
                username: profile.login,
                picture: profile.avatar_url,
                github_id: profile.id,
            };

            if(decodedState.from === "signup") {
                if(User !== null) {
                    throw new TRPCError({ code: 'CONFLICT', message: 'User already exists, please log in instead' });
                }

                const userCreated = await userDb.createUser({
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    picture: user.picture,
                    is_github_verified: true,
                    github_id: user.github_id,
                });

                user.id = userCreated.id
            }

            userDb.createCookie(ctx, user)

            return { success: true, message: "Authentication successful" };

        } catch (error: any) {
            const errorMessage = error instanceof TRPCError ? error.message : 'An unexpected error occurred';
            const errorCode = error instanceof TRPCError ? error.code : 'INTERNAL_SERVER_ERROR';
            console.log(errorCode, errorMessage)
            return { success: false, message: errorMessage };
        }
    })
});

export default github;
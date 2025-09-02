import { publicProcedure, router } from "../../trpc";
import { jwt_secret, jwt_expiry, node_env, github_client_id, redirect_uri, github_auth_uri, github_client_secret, github_token_uri, github_profile_uri } from "../../env";
import z from 'zod';
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"


interface GithubIdTokenPayload {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
}

interface AppJWTPayload {
    id: string;
    email: string;
    name: string;
    picture: string;
}

interface GithubTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
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
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid GitHub access token',
                });
            }

            const { data : profile } : { data: GithubIdTokenPayload } = await axios.get(github_profile_uri, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const user: AppJWTPayload = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                picture: profile.avatar_url,
            };

            const userInfoToken = (jwt as any).sign(user, jwt_secret, { expiresIn: jwt_expiry });

            console.log(userInfoToken, user)

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
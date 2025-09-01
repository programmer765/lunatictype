import { publicProcedure, router } from "../../trpc";
import { jwt_secret, jwt_expiry, node_env, github_client_id, redirect_uri, github_auth_uri, github_client_secret, github_token_uri } from "../../env";
import z from 'zod';
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"


interface GithubIdTokenPayload {
    sub: string;
    email: string;
    name: string;
    picture: string;
}

interface AppJWTPayload {
    email: string;
    name: string;
    picture: string;
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

            const { data } = await axios.post(github_token_uri, {
                code: code,
                client_id: github_client_id,
                client_secret: github_client_secret,
                redirect_uri: redirect_uri,
            });

            const { access_token } = data;

            // console.log(code)

            // const userInfoToken = jwt.verify(access_token, jwt_secret) as AppJWTPayload;

            // ctx.res.cookie("userInfoToken", userInfoToken, {
            //     httpOnly: true,
            //     secure: node_env === "production",
            //     sameSite: node_env === "production" ? "strict" : "lax",
            //     maxAge: 60 * 60 * 1000 // 1 hour
            // });

            return { success: true, data: data }

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
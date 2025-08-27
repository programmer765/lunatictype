import passport from "passport";
import { procedure, t } from "../trpc";
import { z } from 'zod';
import { Request, Response } from "express";
import { TRPCError } from "@trpc/server";

const google_uri = process.env.GOOGLE_AUTH_URI;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const google_redirect_uri = process.env.GOOGLE_REDIRECT_URI || "";
const google_scope = process.env.GOOGLE_SCOPE;

const authRouter = t.router({
    login: procedure.query(() => {
        return { message: "Login route" };
    }),
    register: procedure.query(() => {
        return { message: "Register route" };
    }),
    google: t.router({
        callback: procedure.query(() => {
            console.log("Google callback");
            return { message: "Success" }
        }),
        link: procedure.input(z.object({ redirect_url: z.string().url(), state: z.string().optional() })).mutation(({ input }) => {
            try {
                const redirect_url = input.redirect_url
                const state = input.state || "login"
                // if(redirect_uri === undefined || redirect_uri === null) {
                //     throw Error("Invalid redirect URI")
                // }
                const url = `${google_uri}?client_id=${google_client_id}&redirect_uri=${encodeURIComponent(redirect_url)}&response_type=code&scope=email%20profile%20openid&state=${state}`;
                return { url };
            }
            catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error instanceof Error ? error.message : "An unknown error occurred"
                });
            }
        })
    })
    
})

export default authRouter;
import { t, router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { json, Request, Response } from "express";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"

const google_uri = process.env.GOOGLE_AUTH_URI;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const google_token_uri = process.env.GOOGLE_TOKEN_URI || "";
const google_redirect_uri = process.env.GOOGLE_REDIRECT_URI;
const jwt_secret = process.env.JWT_SECRET || "";
const jwt_expiry = process.env.JWT_EXPIRY || "1h";
const node_env = process.env.NODE_ENV || "development";


interface GoogleIdTokenPayload {
    sub: string;
    email: string;
    name: string;
    picture: string;
}

interface AppJWTPayload {
    openid: string;
    email: string;
    name: string;
    picture: string;
}

const authRouter = router({
    login: publicProcedure.query(() => {
        return { message: "Login route" };
    }),
    register: publicProcedure.query(() => {
        return { message: "Register route" };
    }),
    google: router({
        token: publicProcedure.input(z.object({ code: z.string(), state: z.string().optional() })).mutation( async({ input, ctx }) => {
            try {
                console.log("Google callback");
                const { code, state } = input;
                // return { message: code }
    
                const { data } = await axios.post(google_token_uri, {
                    code: code,
                    client_id: google_client_id,
                    client_secret: google_client_secret,
                    redirect_uri: google_redirect_uri,
                    grant_type: "authorization_code"
                })
    
                const { id_token } = data;

                const decoded = jwt.decode(id_token) as GoogleIdTokenPayload | null;

                if(decoded === null) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: "Invalid ID token"
                    });
                }

                
                const user : AppJWTPayload = {
                    openid: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture
                };
                
                const userInfoToken = (jwt as any).sign(user, jwt_secret, { expiresIn: jwt_expiry})

                ctx.res.cookie("user_info_token", userInfoToken, { 
                    httpOnly: true,
                    secure: node_env === "production",
                    sameSite: node_env === "production" ? "strict" : "lax",
                    maxAge: 60 * 60 * 1000 // 1 hour
                });

                return { success: true }
            }
            catch(error: any) {
                // console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: JSON.stringify((error.response?.data))
                            || (error instanceof Error ? error.message : "An unknown error occurred"),
                });
            }
        }),
        link: publicProcedure.input(z.object({ redirect_url: z.string().url(), state: z.string().optional() })).mutation(({ input }) => {
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
                    message:
                        (typeof error === "object" && error !== null && "response" in error && (error as any).response?.data)
                            || (error instanceof Error ? error.message : "An unknown error occurred"),
                });
            }
        })
    })
    
})

export default authRouter;
import { publicProcedure, router } from "../../trpc";
import { google_client_id, google_client_secret, redirect_uri, google_token_uri, jwt_secret, jwt_expiry, node_env, google_uri } from "../../env";
import z from 'zod';
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"
import UserJWTPayload from "./userJWTPayload";
import userDb from "../../db/user";

interface GoogleIdTokenPayload {
    sub: string;
    email: string;
    name: string;
    given_name: string;
    picture: string;
}

interface StatePayload {
    from: string
    method: string
}

const google = router({
    token: publicProcedure.input(z.object({ code: z.string(), state: z.string() })).mutation( async({ input, ctx }) => {
        try {
            // console.log("Google token");
            const { code, state } = input;

            const decodedState : StatePayload = JSON.parse(decodeURIComponent(state));
            if(decodedState.from !== "signup" && decodedState.from !== "login") {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid state' });
            }

            const { data } = await axios.post(google_token_uri, {
                code: code,
                client_id: google_client_id,
                client_secret: google_client_secret,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code"
            })

            const { id_token } = data;

            const decoded = jwt.decode(id_token) as GoogleIdTokenPayload | null;

            if(decoded === null) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid ID token' });
            }

            const User = await userDb.findByGoogleId(decoded.sub);

            if(decodedState.from === "login" && User === null) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found, please sign up first' });
            }
            
            const user : UserJWTPayload = {
                id: User ? User.id : -1,
                email: decoded.email,
                name: decoded.name,
                username: decoded.given_name,
                picture: decoded.picture,
                google_id: decoded.sub,
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
                    is_google_verified: true,
                    google_id: user.google_id,
                })

                user.id = userCreated.id
            }

            userDb.createCookie(ctx, user)

            return { success: true, message: "Authentication successful" }
        }
        catch(error: any) {
            const errorMessage = error instanceof TRPCError ? error.message : 'An unexpected error occurred';
            console.log("google token error", errorMessage)
            return { success: false, message: errorMessage };
        }
    }),
    link: publicProcedure.input(z.object({ redirect_url: z.string().url(), state: z.string() })).mutation(({ input }) => {
        try {
            const {redirect_url, state} = input;
            const url = `${google_uri}?client_id=${google_client_id}&redirect_uri=${encodeURIComponent(redirect_url)}&response_type=code&scope=email%20profile%20openid&state=${state}`;
            return { url };
        }
        catch (error) {
            return { url: "", message: (error instanceof Error) ? error.message : "An unknown error occurred" };
        }
    })
});

export default google;

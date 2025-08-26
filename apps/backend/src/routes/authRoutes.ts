import passport from "passport";
import { procedure, t } from "../trpc";
import { z } from 'zod';
import { Request, Response } from "express";

const authRouter = t.router({
    login: procedure.query(() => {
        return { message: "Login route" };
    }),
    register: procedure.query(() => {
        return { message: "Register route" };
    }),
    google: t.router({
        callback: procedure.query(() => {
            passport.authenticate('google', { session: false }), (req : Request, res: Response) => {
                if (req.user) {
                    return res.json({ user: req.user });
                }
                return res.status(401).json({ error: "Unauthorized" });
            };
        }),
        
    })
    
})

export default authRouter;
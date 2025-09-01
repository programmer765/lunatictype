import { t, router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from 'zod';
import { json, Request, Response } from "express";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import jwt from "jsonwebtoken"
import google from "./google";
import github from "./github";

const authRouter = router({
    login: publicProcedure.query(() => {
        return { message: "Login route" };
    }),
    register: publicProcedure.query(() => {
        return { message: "Register route" };
    }),
    google: google,

    github: github

})

export default authRouter;
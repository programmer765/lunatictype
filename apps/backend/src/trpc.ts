import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import userDb from "./db/user";
import { userInfoTokenName } from "./env";

export const t = initTRPC.context<Context>().create();

const authMiddleware = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        userDb.deleteCookie(ctx, userInfoTokenName)
        return next()
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    });
});

export const router = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(authMiddleware);
import { Context } from "../context";
import { initTRPC } from "@trpc/server";
import authRouter from "./authRoutes";
import randomWordRouter from "./randomWordRouter";


export type ClientContext = Omit<Context, 'req' | 'res'>;

const t = initTRPC.context<ClientContext>().create();

const router = t.router

const appRouter = router({
    randomWord: randomWordRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter;

import { router, t } from "../trpc";
import randomWordRouter from "./randomWordRouter";
import authRouter from "./authRouters/authRoutes";

const appRouter = router({
    randomWord: randomWordRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter;

export default appRouter;
import { router, t } from "../trpc";
import randomWordRouter from "./randomWordRouter";
import authRouter from "./authRoutes";

const appRouter = router({
    randomWord: randomWordRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter;

export default appRouter;
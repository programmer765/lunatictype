import { router, t } from "../trpc";
import randomWordRouters from "./randomWordRouter";
import authRouters from "./authRouters/authRoutes";
import poolRouters from "./poolRouters/poolRoutes";

const appRouter = router({
    randomWord: randomWordRouters,
    auth: authRouters,
    pool: poolRouters
})

export type AppRouter = typeof appRouter;

export default appRouter;
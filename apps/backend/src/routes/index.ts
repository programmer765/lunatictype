import { router, t } from "../trpc";
import randomWordRouter from "./randomWordRouter";
import userRouter from "./userRoutes";

const appRouter = router({
    randomWord: randomWordRouter,
    user: userRouter,
})

export type AppRouter = typeof appRouter;

export default appRouter;
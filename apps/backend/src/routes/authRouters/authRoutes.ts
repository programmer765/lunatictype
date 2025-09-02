import { router, publicProcedure } from "../../trpc";
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
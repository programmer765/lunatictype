import { router, publicProcedure, protectedProcedure } from "../../trpc";
import google from "./google";
import github from "./github";
import login from "./login";
import signup from "./signup";

const authRouter = router({
    login: login,

    signup: signup,

    google: google,

    github: github,

    me: protectedProcedure.query(async ({ ctx }) => {
        return ctx.user;
    })

})

export default authRouter;
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

    isLoggedIn: protectedProcedure.query(async ({ ctx }) => {
        if(ctx.user) {
            return { success: true, message: "User is logged in", user: ctx.user }
        }
        return { success: false, message: "User is not logged in" };
    })

})

export default authRouter;
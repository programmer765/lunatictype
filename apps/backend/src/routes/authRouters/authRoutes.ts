import { router, publicProcedure, protectedProcedure } from "../../trpc";
import google from "./google";
import github from "./github";
import login from "./login";
import signup from "./signup";
import userDb from "../../db/user";
import { userInfoTokenName } from "../../env";

const authRouter = router({
    login: login,

    signup: signup,

    google: google,

    github: github,

    isLoggedIn: protectedProcedure.query(({ ctx }) => {
        if(ctx.user) {
            return { success: true, message: "User is logged in", user: ctx.user }
        }
        return { success: false, message: "User is not logged in", user: null };
    }),

    logout: protectedProcedure.query(({ ctx }) => {
        try {
            userDb.deleteCookie(ctx, userInfoTokenName);
            return { success: true, message: "User logged out successfully" };
        } catch (error : any) {
            console.error("Error logging out:", error.message);
            return { success: false, message: "Failed to log out" };
        }
    })

})

export default authRouter;
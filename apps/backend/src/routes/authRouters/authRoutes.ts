import { router, publicProcedure } from "../../trpc";
import google from "./google";
import github from "./github";
import login from "./login";
import signup from "./signup";

const authRouter = router({
    login: login,
    signup: signup,
    google: google,

    github: github

})

export default authRouter;
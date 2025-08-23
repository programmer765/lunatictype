import { procedure, t } from "../trpc";
import { z } from 'zod';


const authRouter = t.router({
    login: procedure.query(() => {
        return { message: "Login route" };
    }),
    register: procedure.query(() => {
        return { message: "Register route" };
    }),
    google: t.router({
        login: procedure.input( z.object({ name: z.string() })).mutation(async({ input }) => {
            return { message: `Google login route for ${input.name}` };
        })
    })
})

export default authRouter;
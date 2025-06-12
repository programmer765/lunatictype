import { t } from "../trpc";


const userRouter = t.router({
    getUser: t.procedure.query(() => {
        const user = {
            id: 1,
            name: "Aviprit"
        }
        return user;
    })
})

export default userRouter;
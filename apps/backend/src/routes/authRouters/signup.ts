import { publicProcedure } from "../../trpc";
import z from "zod";
import userDb from "../../db/user";


const signup = publicProcedure.input(z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100)
})).mutation(async ({ input }) => {
    try {
        const { email, password, username } = input;

        // Check if user already exists
        const User = await userDb.findByEmail(email);

        if(User !== null) {
            return { success: false, message: "User already exists" };
        }
        // Create user

        await userDb.createUser({
            email,
            username,
            password
        });

        return { success: true };
    }
    catch (error) {
        return { success: false, message: (error instanceof Error) ? error.message : "An unknown error occurred" };

    }

})


export default signup;
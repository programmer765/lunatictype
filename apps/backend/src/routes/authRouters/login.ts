import { publicProcedure } from "../../trpc";
import z from "zod";
import userDb from "../../db/user";


const login = publicProcedure.input(z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})).mutation(async ({ input }) => {
    const { email, password } = input;

    // Implement login logic here
    const User = await userDb.findByEmail(email);

    if(User === null) {
        return { success: false, message: "User not found" };
    }

    // Verify password
    if(User.password === undefined || User.password === null) {
        return { success: false, message: "User has no password set" };
    }

    const isPasswordValid = await userDb.verifyPassword(User.password, password);
    if (!isPasswordValid) {
        return { success: false, message: "Invalid password" };
    }

    return { success: true };

})

export default login;
import { publicProcedure } from "../../trpc";
import z from "zod";
import userDb from "../../db/user";
import UserJWTPayload from "./userJWTPayload";


const login = publicProcedure.input(z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})).mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    // Implement login logic here
    const User = await userDb.findByEmail(email);

    if(User === null) {
        return { success: false, message: "User not found, Please check your email and try again." };
    }

    // Verify password
    if(User.password === undefined || User.password === null) {
        return { success: false, message: "User has no password set, Please contact support." };
    }

    const isPasswordValid = await userDb.verifyPassword(User.password, password);
    if (!isPasswordValid) {
        return { success: false, message: "Invalid password, Please try again." };
    }

    const user : UserJWTPayload = {
        id: User.id.toString(),
        email: User.email,
        username: User.username,
    }

    userDb.createCookie(ctx, user)

    return { success: true, message: "Login successful" };

})

export default login;
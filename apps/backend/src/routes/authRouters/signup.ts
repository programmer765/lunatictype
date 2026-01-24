import { publicProcedure } from "../../trpc";
import z from "zod";
import userDb from "../../db/user";
import UserJWTPayload from "./userJWTPayload";


const signup = publicProcedure.input(z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100)
})).mutation(async ({ input, ctx }) => {
    try {
        const { email, password, username } = input;

        // Check if user already exists
        const User = await userDb.findByEmail(email);

        if(User !== null) {
            return { success: false, message: "User already exists" };
        }
        // Create user

        const newUser = await userDb.createUser({
            email,
            username,
            password
        });
        
        const user : UserJWTPayload = {
            id: newUser.id.toString(),
            username: newUser.username,
            email: newUser.email
        }
        
        if(newUser.name !== null && newUser.name !== undefined) {
            user.name = newUser.name
        }

        if(newUser.picture !== null && newUser.picture !== undefined) {
            user.picture = newUser.picture
        }

        userDb.createCookie(ctx, user)

        return { success: true, message: "Signup successful" };
    }
    catch (error) {
        return { success: false, message: (error instanceof Error) ? error.message : "An unknown error occurred" };

    }

})


export default signup;
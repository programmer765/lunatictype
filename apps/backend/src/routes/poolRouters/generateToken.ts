import { publicProcedure } from "../../trpc";
import jwt from "jsonwebtoken"
import { jwt_secret } from "../../env";
import z from "zod";



const generateToken = publicProcedure.input( z.object({ userId: z.number() }) ).mutation( async ({ input }) => {
    const { userId } = input;
    const token = jwt.sign({ userId }, jwt_secret, { expiresIn: '1h' });
    return { token };
})

export default generateToken;
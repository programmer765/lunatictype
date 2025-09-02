import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET || ""


interface UserContext {
    id: string;
    email: string;
    name: string;
    picture: string;
}


interface TRPCContext {
    req: CreateExpressContextOptions['req']
    res: CreateExpressContextOptions['res']
    user: UserContext | null
}


const createContext = async ({ req, res} : CreateExpressContextOptions) => {
    const userInfoToken = req.cookies['userInfoToken']
    let user : TRPCContext["user"] = null
    if(userInfoToken) {
        try {
            const decoded = jwt.verify(userInfoToken, jwt_secret) as UserContext
            user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture
            }
        } catch (error) {
            console.error(error)
        }
    }

    return { req, res, user}
}

export default createContext

export type Context = Awaited<ReturnType<typeof createContext>>

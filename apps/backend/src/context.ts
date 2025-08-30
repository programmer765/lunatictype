import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET || ""


interface UserContext {
    openid: string;
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
    const authHeader = req.headers.authorization
    let user : TRPCContext["user"] = null
    if(authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1] || ""
        try {
            const decoded = jwt.verify(token, jwt_secret) as any
            user = {
                openid: decoded.sub,
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

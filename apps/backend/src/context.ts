import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET || ""

const createContext = async ({ req, res} : CreateExpressContextOptions) => {
    const authHeader = req.headers.authorization
    let user = null
    if(authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1] || ""
        try {
            const decoded = jwt.verify(token, jwt_secret)
            user = decoded
        } catch (error) {
            console.error(error)
        }
    }

    return { req, res, user}
}

export default createContext

export type Context = Awaited<ReturnType<typeof createContext>>

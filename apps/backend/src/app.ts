import express, { Request, Response} from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import dotenv from 'dotenv';
dotenv.config();
import appRouter from './routes';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
// app.use(passport.session());


app.get('/', (req: Request, res: Response) => {
    try {
        return res.json({ message: "Hello World" });
    }
    catch (error) {
        console.error(error);
    }
})

// app.get('/getWords', (req: Request, res: Response) => {
//     try {
//         return res.json({ message: "Hello World" });
//     }
//     catch (error) {
//         console.error(error);
//     }
// })

app.use('/api', createExpressMiddleware({ router: appRouter }));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
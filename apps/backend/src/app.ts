import express, { Request, Response} from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import appRouter from './routes';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
// app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "/auth.google.callback"
}, (accessToken, refreshToken, profile, done) => {
    // Here you would find or create a user in your database
    done(null, profile);
}));


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
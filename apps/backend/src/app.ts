import express, { Request, Response} from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import appRouter from './routes';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
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
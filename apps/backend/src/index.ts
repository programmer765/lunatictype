import express, { Request, Response} from 'express';
import randomWordRouter from './routes/randomWordRoutes';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import userRouter from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());


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

app.use('/randomWord', createExpressMiddleware({ router: randomWordRouter }));
app.use('/user', createExpressMiddleware({ router: userRouter }));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
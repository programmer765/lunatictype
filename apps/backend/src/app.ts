import express, { Request, Response} from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
import appRouter from './routes';
import createContext from './context';
import { supabase_anon_key, supabase_url } from './env';

const client_url = process.env.CLIENT_URL ?? "*";

const app = express();

app.use(cors( { origin: client_url, credentials: true } ));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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

app.use('/api', createExpressMiddleware({ router: appRouter, createContext }));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
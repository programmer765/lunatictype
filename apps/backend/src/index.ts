import express, { Request, Response} from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    try {
        return res.json({ message: "Hello World" });
    }
    catch (error) {
        console.error(error);
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
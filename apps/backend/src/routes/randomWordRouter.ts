import { Router, Request, Response } from 'express';
import { generate, count} from 'random-words';
import { procedure, router, t } from '../trpc';
import { z } from 'zod';

const wordCount = 50;

// const router : Router = Router();

// router.get('/generate', (req: Request, res: Response) => {
//     try {
//         const randomWord = generate(50);
//         return res.json({ words: randomWord });
//     }
//     catch (error) {
//         console.error(error);
//         return res.json({ message: "Internal server error" });
//     }
// })


// router.post('/generate', (req: Request, res: Response) => {
//     try {
//         const { wordCount } : { wordCount: string } = req.body;
//         const wordCountNum : number = parseInt(wordCount);
//         const randomWord = generate(wordCountNum);
//         return res.json({ words: randomWord });
//     }
//     catch (error) {
//         console.error(error);
//         return res.json({ message: "Internal server error" });
//     }
// })

// export default router;

const randomWordRouter = router({
    generate: procedure.query(() => {
        const randomWord = generate(wordCount);
        console.log('api/randomWordRouter.generate')
        return randomWord;
    })
})

export default randomWordRouter;
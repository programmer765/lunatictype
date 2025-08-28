import { Router, Request, Response } from 'express';
import { generate, count} from 'random-words';
import { publicProcedure, protectedProcedure , router, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

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
    generate: protectedProcedure.query(() => {
        try {
            console.log('api/randomWordRouter.generate')
            const randomWord = generate(wordCount);
            if(Array.isArray(randomWord) === false || randomWord === undefined || randomWord === null) {
                throw Error("randomWords did not generate propery. It is either not an array or undefined")
            }
            const words = Array.isArray(randomWord) ? randomWord : [""]
            return words;
        }
        catch(err) {
            console.log(`Server error: ${err}`)
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: err instanceof Error ? err.message : "An unknown error occurred"
            })
        }
    })
})

export default randomWordRouter;
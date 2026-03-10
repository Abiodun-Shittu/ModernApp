import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server!!!');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'This is a JSON response' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server!!!');
});
app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'This is a JSON response' });
});

const chatSChema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt must be less than 1000 characters'),
   conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parsed = chatSChema.safeParse(req.body);
   if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
   }

   try {
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(conversationId, prompt);
      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({
         error: 'An error occurred while processing your request.',
      });
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server!!!');
});
app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'This is a JSON response' });
});

const conversations = new Map<string, string>();
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
   const { prompt, conversationId } = req.body;

   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
   });

   conversations.set(conversationId, response.id);

   res.json({ message: response.output_text });
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});

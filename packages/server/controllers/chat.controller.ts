import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSChema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt must be less than 1000 characters'),
   conversationId: z.string().uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
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
   },
};

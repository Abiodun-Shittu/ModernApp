import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const router = express.Router();

// Prisma 7 MySQL/MariaDB adapter singleton
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

router.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server!!!');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'This is a JSON response' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   // const prisma = new PrismaClient();
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
   }

   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });
   res.json(reviews);
});

export default router;

import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Prisma 7 MySQL/MariaDB adapter singleton
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      // Implementation for fetching reviews
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },
};

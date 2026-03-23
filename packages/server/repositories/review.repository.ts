import { PrismaClient, type Review } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      // Prisma 7 MySQL/MariaDB adapter singleton
      const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
      const prisma = new PrismaClient({ adapter });
      // Implementation for fetching reviews
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};

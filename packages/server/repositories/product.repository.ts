import { PrismaClient, type Review } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Prisma 7 MySQL/MariaDB adapter singleton
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export const productRepository = {
   async getProduct(productId: number) {
      // Implementation for fetching a product by ID
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};

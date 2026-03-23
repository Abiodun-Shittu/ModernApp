// test-db.ts
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const result = await prisma.$queryRaw`SELECT 1`;
console.log('Connected!', result);
await prisma.$disconnect();

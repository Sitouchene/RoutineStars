import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Singleton Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;



import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'SET' : 'NOT SET');

// Test avec DIRECT_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

try {
  const users = await prisma.user.findMany();
  console.log('✅ Connexion directe OK -', users.length, 'utilisateurs trouvés');
} catch (error) {
  console.log('❌ Erreur connexion directe:', error.message);
}

await prisma.$disconnect();

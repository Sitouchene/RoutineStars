import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function verifyConfig() {
  console.log('🔍 Vérification de la configuration...\n');
  
  // Vérifier DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL non définie');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL trouvée');
  
  // Vérifier pgbouncer parameter
  if (!dbUrl.includes('pgbouncer=true')) {
    console.warn('⚠️  pgbouncer=true manquant dans DATABASE_URL');
    console.log('   Ajouter: ?pgbouncer=true&connection_limit=1');
  } else {
    console.log('✅ Configuration PgBouncer détectée');
  }
  
  // Vérifier connection_limit
  if (!dbUrl.includes('connection_limit')) {
    console.warn('⚠️  connection_limit manquant dans DATABASE_URL');
  } else {
    console.log('✅ Connection limit configuré');
  }
  
  // Tester connexion
  console.log('\n🔗 Test de connexion à la base de données...');
  try {
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    
    // Tester une requête simple
    const userCount = await prisma.user.count();
    console.log(`✅ Requête test réussie: ${userCount} utilisateurs trouvés`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('\n✅ Configuration validée!');
}

verifyConfig();

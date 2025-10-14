import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndCleanDatabase() {
  try {
    console.log('🔍 Checking database state...');
    
    // Vérifier les colonnes familyId restantes
    const familyIdColumns = await prisma.$queryRaw`
      SELECT column_name, table_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name = 'familyId'
    `;
    
    console.log('📋 familyId columns found:', familyIdColumns);
    
    if (familyIdColumns.length > 0) {
      console.log('🧹 Cleaning up familyId columns...');
      
      // Supprimer les contraintes de clés étrangères
      const constraints = await prisma.$queryRaw`
        SELECT constraint_name, table_name
        FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND constraint_name LIKE '%familyId%'
      `;
      
      console.log('🔗 Foreign key constraints:', constraints);
      
      // Supprimer les colonnes familyId
      for (const column of familyIdColumns) {
        console.log(`🗑️ Dropping familyId from ${column.table_name}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "${column.table_name}" DROP COLUMN IF EXISTS "familyId"`);
      }
    }
    
    // Vérifier l'état final
    const finalCheck = await prisma.$queryRaw`
      SELECT column_name, table_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name IN ('familyId', 'groupId')
    `;
    
    console.log('✅ Final state:', finalCheck);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCleanDatabase();

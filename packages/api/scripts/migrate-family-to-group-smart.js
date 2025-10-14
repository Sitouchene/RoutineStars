import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateFamilyToGroup() {
  try {
    console.log('🚀 Starting Family → Group migration...');
    
    // Vérifier l'état actuel de la base
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('families', 'groups')
    `;
    
    console.log('📊 Current tables:', tables);
    
    // Si la table groups existe déjà, on skip la création
    const groupsExists = tables.some(t => t.table_name === 'groups');
    const familiesExists = tables.some(t => t.table_name === 'families');
    
    if (groupsExists && !familiesExists) {
      console.log('✅ Migration already completed!');
      return;
    }
    
    if (!groupsExists) {
      console.log('📝 Creating groups table...');
      await prisma.$executeRaw`
        CREATE TABLE "groups" (
          "id" TEXT NOT NULL,
          "type" TEXT NOT NULL DEFAULT 'family',
          "name" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "language" TEXT NOT NULL DEFAULT 'fr',
          "country" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
        )
      `;
    }
    
    // Générer des codes pour les familles existantes
    if (familiesExists) {
      console.log('🔄 Migrating families to groups...');
      await prisma.$executeRaw`
        INSERT INTO "groups" ("id", "type", "name", "code", "language", "createdAt", "updatedAt")
        SELECT 
          "id",
          'family' as "type",
          "name",
          'FAMILY_' || SUBSTRING("id", 1, 8) as "code",
          'fr' as "language",
          "createdAt",
          "updatedAt"
        FROM "families"
        ON CONFLICT ("id") DO NOTHING
      `;
    }
    
    // Ajouter les nouvelles colonnes si elles n'existent pas
    const columns = await prisma.$queryRaw`
      SELECT column_name, table_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('categories', 'users', 'task_templates', 'daily_messages', 'evaluation_windows')
      AND column_name IN ('groupId', 'theme')
    `;
    
    console.log('📋 Existing columns:', columns);
    
    const existingColumns = columns.map(c => `${c.table_name}.${c.column_name}`);
    
    // Ajouter groupId aux tables si nécessaire
    const tablesToUpdate = [
      { table: 'categories', column: 'groupId' },
      { table: 'users', column: 'groupId' },
      { table: 'task_templates', column: 'groupId' },
      { table: 'daily_messages', column: 'groupId' },
      { table: 'evaluation_windows', column: 'groupId' }
    ];
    
    for (const { table, column } of tablesToUpdate) {
      if (!existingColumns.includes(`${table}.${column}`)) {
        console.log(`➕ Adding ${column} to ${table}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "${column}" TEXT`);
      }
    }
    
    // Ajouter theme à users si nécessaire
    if (!existingColumns.includes('users.theme')) {
      console.log('➕ Adding theme to users...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'default'`;
    }
    
    // Mettre à jour les références
    console.log('🔄 Updating references...');
    await prisma.$executeRaw`UPDATE "categories" SET "groupId" = "familyId" WHERE "familyId" IS NOT NULL`;
    await prisma.$executeRaw`UPDATE "users" SET "groupId" = "familyId" WHERE "familyId" IS NOT NULL`;
    await prisma.$executeRaw`UPDATE "task_templates" SET "groupId" = "familyId" WHERE "familyId" IS NOT NULL`;
    await prisma.$executeRaw`UPDATE "daily_messages" SET "groupId" = "familyId" WHERE "familyId" IS NOT NULL`;
    await prisma.$executeRaw`UPDATE "evaluation_windows" SET "groupId" = "familyId" WHERE "familyId" IS NOT NULL`;
    
    // Ajouter l'index unique pour le code
    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX "groups_code_key" ON "groups"("code")`;
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Vérifier la migration
    const groupsCount = await prisma.group.count();
    console.log(`📊 Found ${groupsCount} groups after migration`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateFamilyToGroup()
  .then(() => {
    console.log('🎉 Migration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  });

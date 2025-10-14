import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateFamilyToGroup() {
  try {
    console.log('🚀 Starting Family → Group migration...');
    
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'prisma', 'migrations', 'family_to_group.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        await prisma.$executeRawUnsafe(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the migration
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateTaskTemplatesToCategories() {
  console.log('🔄 Migrating existing task templates to use categories...');

  try {
    // Récupérer tous les task templates existants
    const taskTemplates = await prisma.taskTemplate.findMany();
    
    console.log(`📋 Found ${taskTemplates.length} task templates to migrate`);

    for (const template of taskTemplates) {
      // Trouver la catégorie commune correspondante
      const category = await prisma.category.findFirst({
        where: {
          familyId: null, // Catégories communes
          title: template.category // Ancien champ category
        }
      });

      if (category) {
        // Mettre à jour le task template avec la nouvelle categoryId
        await prisma.taskTemplate.update({
          where: { id: template.id },
          data: { 
            categoryId: category.id
          }
        });
        
        console.log(`✅ Migrated template: ${template.title} -> ${category.display}`);
      } else {
        console.log(`⚠️  No category found for template: ${template.title} (category: ${template.category})`);
      }
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateTaskTemplatesToCategories();

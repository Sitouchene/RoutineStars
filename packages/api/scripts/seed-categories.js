import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commonCategories = [
  {
    title: 'household',
    display: 'Maison',
    description: 'Je participe aux tâches ménagères',
    icon: '🏠',
    isSystem: true,
    isActive: true
  },
  {
    title: 'routine',
    display: 'Routine',
    description: 'J\'apprends de bonnes habitudes et hygiène de vie',
    icon: '🌅',
    isSystem: true,
    isActive: true
  },
  {
    title: 'study',
    display: 'Études',
    description: 'Je suis appliqué et j\'apprends en continu',
    icon: '📚',
    isSystem: true,
    isActive: true
  }
];

async function seedCommonCategories() {
  console.log('🌱 Seeding system categories...');

  try {
    for (const categoryData of commonCategories) {
      // Vérifier si la catégorie existe déjà
      const existingCategory = await prisma.category.findFirst({
        where: {
          title: categoryData.title
        }
      });

      if (existingCategory) {
        console.log(`⚠️  System category already exists: ${categoryData.display} (${categoryData.title})`);
        continue;
      }

      // Créer la catégorie système
      const category = await prisma.category.create({
        data: {
          ...categoryData,
          familyId: null // Catégories système (pas de famille)
        }
      });
      
      console.log(`✅ System category created: ${category.display} (${category.title})`);
    }

    console.log('✅ System categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding system categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCommonCategories();

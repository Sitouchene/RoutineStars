import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating books with googleBookId to global...');
  
  try {
    // Promouvoir les livres avec googleBookId en global
    const updated = await prisma.book.updateMany({
      where: {
        googleBookId: { not: null },
        groupId: { not: null }
      },
      data: { groupId: null }
    });
    
    console.log(`✅ ${updated.count} livres promus en global`);
    
    // Afficher les statistiques
    const stats = await prisma.book.groupBy({
      by: ['groupId'],
      _count: {
        id: true
      }
    });
    
    console.log('\n📊 Statistiques des livres:');
    stats.forEach(stat => {
      const type = stat.groupId ? 'Groupe' : 'Global';
      console.log(`  ${type}: ${stat._count.id} livres`);
    });
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

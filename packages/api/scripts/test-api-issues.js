import prisma from '../src/config/database.js';

/**
 * Script de test pour vérifier les problèmes d'API
 */
async function testApiIssues() {
  console.log('🔍 Test des problèmes d\'API...\n');

  try {
    // 1. Vérifier les BookTemplates
    console.log('1️⃣ Vérification des BookTemplates...');
    const templates = await prisma.bookTemplate.findMany({
      take: 5
    });
    console.log(`   ✅ ${templates.length} templates trouvés`);
    if (templates.length > 0) {
      console.log(`   📚 Exemple: "${templates[0].title}" (${templates[0].language})`);
    }

    // 2. Vérifier les livres existants
    console.log('\n2️⃣ Vérification des livres...');
    const books = await prisma.book.findMany({
      take: 5,
      include: {
        group: true
      }
    });
    console.log(`   ✅ ${books.length} livres trouvés`);
    books.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" - Groupe: ${book.group?.name || 'Global'}`);
    });

    // 3. Vérifier les groupes
    console.log('\n3️⃣ Vérification des groupes...');
    const groups = await prisma.group.findMany({
      take: 3
    });
    console.log(`   ✅ ${groups.length} groupes trouvés`);
    groups.forEach((group, index) => {
      console.log(`   ${index + 1}. "${group.name}" (${group.type})`);
    });

    // 4. Vérifier les utilisateurs
    console.log('\n4️⃣ Vérification des utilisateurs...');
    const users = await prisma.user.findMany({
      where: { role: 'parent' },
      take: 3
    });
    console.log(`   ✅ ${users.length} parents trouvés`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. "${user.name}" (${user.email})`);
    });

    // 5. Test de création d'un livre
    console.log('\n5️⃣ Test de création d\'un livre...');
    try {
      const testBook = await prisma.book.create({
        data: {
          title: 'Test Book API',
          author: 'Test Author',
          totalPages: 100,
          language: 'fr',
          genres: ['Test'],
          groupId: groups[0]?.id || null
        },
        include: {
          group: true
        }
      });
      console.log(`   ✅ Livre créé: "${testBook.title}"`);
      
      // Supprimer le livre de test
      await prisma.book.delete({
        where: { id: testBook.id }
      });
      console.log(`   ✅ Livre de test supprimé`);
    } catch (error) {
      console.log(`   ❌ Erreur lors de la création: ${error.message}`);
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Résumé:');
    console.log(`   - ${templates.length} templates de livres`);
    console.log(`   - ${books.length} livres existants`);
    console.log(`   - ${groups.length} groupes`);
    console.log(`   - ${users.length} parents`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiIssues();


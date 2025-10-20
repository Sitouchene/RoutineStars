import prisma from '../src/config/database.js';

/**
 * Script pour obtenir un token d'authentification valide
 */
async function getAuthToken() {
  try {
    // Trouver un utilisateur parent
    const parent = await prisma.user.findFirst({
      where: { role: 'parent' }
    });

    if (!parent) {
      console.log('❌ Aucun parent trouvé');
      return null;
    }

    console.log(`✅ Parent trouvé: ${parent.name} (${parent.email})`);
    
    // Pour ce test, nous allons simuler un token
    // En réalité, il faudrait utiliser le système d'authentification JWT
    console.log('🔑 Pour tester l\'API, utilisez ce token dans les headers:');
    console.log(`Authorization: Bearer test-token-for-${parent.id}`);
    
    return parent.id;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

getAuthToken();


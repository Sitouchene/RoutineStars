import jwt from 'jsonwebtoken';
import prisma from '../src/config/database.js';

/**
 * Script pour tester l'import Google avec un token JWT valide
 */
async function testGoogleImport() {
  try {
    // Trouver un utilisateur parent
    const parent = await prisma.user.findFirst({
      where: { role: 'parent' },
      include: { group: true }
    });

    if (!parent) {
      console.log('❌ Aucun parent trouvé');
      return;
    }

    console.log(`✅ Parent trouvé: ${parent.name} (${parent.email})`);
    console.log(`📚 Groupe: ${parent.group?.name || 'Aucun'}`);

    // Générer un token JWT valide
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        id: parent.id, 
        role: parent.role, 
        groupId: parent.groupId 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 Token JWT généré');
    console.log(`Token: ${token.substring(0, 50)}...`);

    // Tester l'import Google avec curl
    const googleBookId = '7k48EAAAQBAJ'; // Tea Stilton
    const groupId = parent.groupId || 'test-group-id';

    console.log(`\n🧪 Test d'import Google pour le livre: ${googleBookId}`);
    console.log(`📚 Groupe ID: ${groupId}`);

    const curlCommand = `curl -X POST http://localhost:3001/api/books/import/google/${googleBookId} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{"groupId":"${groupId}"}'`;

    console.log('\n📋 Commande curl à exécuter:');
    console.log(curlCommand);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGoogleImport();


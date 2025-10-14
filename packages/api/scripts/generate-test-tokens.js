import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateTestTokens() {
  try {
    console.log('🔑 Generating test JWT tokens...');
    
    // Récupérer les utilisateurs de test
    const parent = await prisma.user.findFirst({
      where: { role: 'parent' },
      include: { group: true }
    });
    
    const teacher = await prisma.user.findFirst({
      where: { role: 'teacher' },
      include: { group: true }
    });
    
    if (!parent || !teacher) {
      throw new Error('Test users not found. Run create-test-data.js first.');
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    // Token pour le parent
    const parentToken = jwt.sign(
      {
        userId: parent.id,
        groupId: parent.groupId,
        familyId: parent.groupId, // Pour compatibilité
        role: parent.role,
        email: parent.email,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Token pour l'enseignant
    const teacherToken = jwt.sign(
      {
        userId: teacher.id,
        groupId: teacher.groupId,
        familyId: teacher.groupId, // Pour compatibilité
        role: teacher.role,
        email: teacher.email,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('\n🎉 Test tokens generated successfully!');
    console.log('\n📋 Use these tokens in Postman:');
    console.log('\n👨‍👩‍👧‍👦 Parent Token (Family):');
    console.log(`Bearer ${parentToken}`);
    console.log('\n👩‍🏫 Teacher Token (Classroom):');
    console.log(`Bearer ${teacherToken}`);
    
    console.log('\n📝 Instructions for Postman:');
    console.log('1. Copy one of the tokens above');
    console.log('2. In Postman, go to Authorization tab');
    console.log('3. Select "Bearer Token"');
    console.log('4. Paste the token (without "Bearer " prefix)');
    console.log('5. Test the protected endpoints!');
    
    return {
      parentToken,
      teacherToken,
      parent,
      teacher
    };
    
  } catch (error) {
    console.error('❌ Error generating tokens:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the token generation
generateTestTokens()
  .then(() => {
    console.log('\n✅ Token generation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Token generation failed:', error);
    process.exit(1);
  });

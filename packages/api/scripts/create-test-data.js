import { PrismaClient } from '@prisma/client';
import { generateUniqueGroupCode } from './generate-group-code.js';

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('🧪 Creating test data for Groups API...');
    
    // Créer un groupe famille de test
    const familyCode = await generateUniqueGroupCode(prisma);
    const familyGroup = await prisma.group.create({
      data: {
        type: 'family',
        name: 'Famille Test',
        code: familyCode,
        language: 'fr',
      },
    });
    
    console.log('✅ Family group created:', familyGroup);
    
    // Créer un groupe classe de test
    const classroomCode = await generateUniqueGroupCode(prisma);
    const classroomGroup = await prisma.group.create({
      data: {
        type: 'classroom',
        name: 'Classe CM2A',
        code: classroomCode,
        language: 'fr',
      },
    });
    
    console.log('✅ Classroom group created:', classroomGroup);
    
    // Créer un parent pour la famille
    const parent = await prisma.user.create({
      data: {
        groupId: familyGroup.id,
        role: 'parent',
        name: 'Marie Dupont',
        email: 'marie.dupont@test.com',
        password: '$2b$10$example', // Mot de passe haché factice
      },
    });
    
    console.log('✅ Parent created:', parent);
    
    // Créer un enfant pour la famille
    const child = await prisma.user.create({
      data: {
        groupId: familyGroup.id,
        role: 'child',
        name: 'Lucas Dupont',
        age: 8,
        pin: '$2b$10$example', // PIN haché factice
        theme: 'boy',
      },
    });
    
    console.log('✅ Child created:', child);
    
    // Créer un enseignant pour la classe
    const teacher = await prisma.user.create({
      data: {
        groupId: classroomGroup.id,
        role: 'teacher',
        name: 'Mme Martin',
        email: 'martin@ecole.fr',
        password: '$2b$10$example',
      },
    });
    
    console.log('✅ Teacher created:', teacher);
    
    // Créer un élève pour la classe
    const student = await prisma.user.create({
      data: {
        groupId: classroomGroup.id,
        role: 'student',
        name: 'Emma Leroy',
        age: 10,
        pin: '$2b$10$example',
        theme: 'girl',
      },
    });
    
    console.log('✅ Student created:', student);
    
    console.log('\n🎉 Test data created successfully!');
    console.log('\n📋 Test Groups:');
    console.log(`Family: ${familyGroup.name} - Code: ${familyGroup.code}`);
    console.log(`Classroom: ${classroomGroup.name} - Code: ${classroomGroup.code}`);
    
    return {
      familyGroup,
      classroomGroup,
      parent,
      child,
      teacher,
      student,
    };
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test data creation
createTestData()
  .then(() => {
    console.log('✅ Test data creation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test data creation failed:', error);
    process.exit(1);
  });

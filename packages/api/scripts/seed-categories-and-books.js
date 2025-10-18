import prisma from '../src/config/database.js';

/**
 * Script de seed pour les catégories de base et les templates de livres
 */
async function seedCategoriesAndBooks() {
  try {
    console.log('🌱 Début du seed des catégories et livres...');

    // 1. Créer les catégories de base
    console.log('📂 Création des catégories de base...');
    
    const categories = [
      { title: 'Hygiène', display: '🧼 Hygiène', description: 'Se laver, se brosser les dents, etc.', icon: '🧼', isSystem: true },
      { title: 'Ménage', display: '🧹 Ménage', description: 'Ranger sa chambre, aider aux tâches', icon: '🧹', isSystem: true },
      { title: 'École', display: '📚 École', description: 'Devoirs, révisions, préparation', icon: '📚', isSystem: true },
      { title: 'Sport', display: '⚽ Sport', description: 'Activités physiques et sportives', icon: '⚽', isSystem: true },
      { title: 'Lecture', display: '📖 Lecture', description: 'Lire des livres et magazines', icon: '📖', isSystem: true },
      { title: 'Créativité', display: '🎨 Créativité', description: 'Dessin, bricolage, musique', icon: '🎨', isSystem: true },
      { title: 'Social', display: '👥 Social', description: 'Aider les autres, être gentil', icon: '👥', isSystem: true },
      { title: 'Autonomie', display: '🦋 Autonomie', description: 'Être responsable et indépendant', icon: '🦋', isSystem: true }
    ];

    for (const categoryData of categories) {
      const existing = await prisma.category.findFirst({
        where: { title: categoryData.title, isSystem: true }
      });

      if (!existing) {
        await prisma.category.create({
          data: categoryData
        });
        console.log(`✅ Catégorie créée: ${categoryData.display}`);
      } else {
        console.log(`⏭️ Catégorie existante: ${categoryData.display}`);
      }
    }

    // 2. Créer les templates de livres
    console.log('\n📚 Création des templates de livres...');
    
    const bookTemplates = [
      // Livres français
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        totalPages: 96,
        language: 'fr',
        genres: ['Fiction', 'Littérature jeunesse'],
        synopsis: 'Un conte poétique et philosophique sur l\'amitié et l\'amour.',
        ageRange: { min: 8, max: 12 },
        themes: ['Amitié', 'Voyage', 'Philosophie'],
        googleBookId: 'fr_petit_prince'
      },
      {
        title: 'Harry Potter à l\'école des sorciers',
        author: 'J.K. Rowling',
        totalPages: 320,
        language: 'fr',
        genres: ['Fantasy', 'Littérature jeunesse'],
        synopsis: 'L\'histoire d\'un jeune sorcier découvrant son monde magique.',
        ageRange: { min: 10, max: 16 },
        themes: ['Magie', 'Amitié', 'Aventure'],
        googleBookId: 'fr_harry_potter_1'
      },
      {
        title: 'Le Livre de la jungle',
        author: 'Rudyard Kipling',
        totalPages: 240,
        language: 'fr',
        genres: ['Aventure', 'Littérature jeunesse'],
        synopsis: 'Les aventures de Mowgli dans la jungle indienne.',
        ageRange: { min: 8, max: 14 },
        themes: ['Nature', 'Animaux', 'Aventure'],
        googleBookId: 'fr_livre_jungle'
      },
      {
        title: 'Les Trois Mousquetaires',
        author: 'Alexandre Dumas',
        totalPages: 600,
        language: 'fr',
        genres: ['Aventure', 'Historique'],
        synopsis: 'Les aventures de d\'Artagnan et ses amis mousquetaires.',
        ageRange: { min: 12, max: 18 },
        themes: ['Amitié', 'Honneur', 'Aventure'],
        googleBookId: 'fr_trois_mousquetaires'
      },
      {
        title: 'Vingt mille lieues sous les mers',
        author: 'Jules Verne',
        totalPages: 400,
        language: 'fr',
        genres: ['Science-fiction', 'Aventure'],
        synopsis: 'Un voyage extraordinaire dans les profondeurs océaniques.',
        ageRange: { min: 10, max: 16 },
        themes: ['Science', 'Aventure', 'Exploration'],
        googleBookId: 'fr_vingt_mille_lieues'
      },
      {
        title: 'Le Comte de Monte-Cristo',
        author: 'Alexandre Dumas',
        totalPages: 1200,
        language: 'fr',
        genres: ['Drame', 'Historique'],
        synopsis: 'L\'histoire d\'Edmond Dantès et sa vengeance.',
        ageRange: { min: 14, max: 18 },
        themes: ['Vengeance', 'Justice', 'Drame'],
        googleBookId: 'fr_comte_monte_cristo'
      },
      {
        title: 'Les Fables de La Fontaine',
        author: 'Jean de La Fontaine',
        totalPages: 200,
        language: 'fr',
        genres: ['Poésie', 'Littérature jeunesse'],
        synopsis: 'Des fables morales avec des animaux comme personnages.',
        ageRange: { min: 6, max: 12 },
        themes: ['Morale', 'Animaux', 'Poésie'],
        googleBookId: 'fr_fables_lafontaine'
      },
      {
        title: 'Astérix le Gaulois',
        author: 'René Goscinny',
        totalPages: 48,
        language: 'fr',
        genres: ['Bande dessinée', 'Humour'],
        synopsis: 'Les aventures d\'Astérix et Obélix en Gaule.',
        ageRange: { min: 8, max: 14 },
        themes: ['Humour', 'Histoire', 'Aventure'],
        googleBookId: 'fr_asterix_gaulois'
      },

      // Livres anglais
      {
        title: 'The Cat in the Hat',
        author: 'Dr. Seuss',
        totalPages: 64,
        language: 'en',
        genres: ['Littérature jeunesse', 'Humour'],
        synopsis: 'A mischievous cat brings chaos to two children\'s home.',
        ageRange: { min: 4, max: 8 },
        themes: ['Humour', 'Imagination', 'Responsabilité'],
        googleBookId: 'en_cat_in_hat'
      },
      {
        title: 'Charlotte\'s Web',
        author: 'E.B. White',
        totalPages: 192,
        language: 'en',
        genres: ['Fiction', 'Littérature jeunesse'],
        synopsis: 'A story about friendship between a pig and a spider.',
        ageRange: { min: 8, max: 12 },
        themes: ['Amitié', 'Animaux', 'Mort'],
        googleBookId: 'en_charlottes_web'
      },
      {
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        totalPages: 208,
        language: 'en',
        genres: ['Fantasy', 'Littérature jeunesse'],
        synopsis: 'Four children discover the magical world of Narnia.',
        ageRange: { min: 8, max: 14 },
        themes: ['Fantasy', 'Aventure', 'Courage'],
        googleBookId: 'en_narnia_1'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        totalPages: 384,
        language: 'en',
        genres: ['Drame', 'Historique'],
        synopsis: 'A story about racial injustice in the American South.',
        ageRange: { min: 14, max: 18 },
        themes: ['Justice', 'Racisme', 'Croissance'],
        googleBookId: 'en_to_kill_mockingbird'
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        totalPages: 320,
        language: 'en',
        genres: ['Fantasy', 'Aventure'],
        synopsis: 'Bilbo Baggins\' unexpected journey to the Lonely Mountain.',
        ageRange: { min: 10, max: 16 },
        themes: ['Fantasy', 'Aventure', 'Courage'],
        googleBookId: 'en_hobbit'
      },
      {
        title: 'Alice\'s Adventures in Wonderland',
        author: 'Lewis Carroll',
        totalPages: 192,
        language: 'en',
        genres: ['Fantasy', 'Littérature jeunesse'],
        synopsis: 'Alice falls down a rabbit hole into a fantasy world.',
        ageRange: { min: 8, max: 14 },
        themes: ['Fantasy', 'Imagination', 'Aventure'],
        googleBookId: 'en_alice_wonderland'
      },
      {
        title: 'The Secret Garden',
        author: 'Frances Hodgson Burnett',
        totalPages: 288,
        language: 'en',
        genres: ['Fiction', 'Littérature jeunesse'],
        synopsis: 'A young girl discovers a hidden garden.',
        ageRange: { min: 8, max: 14 },
        themes: ['Nature', 'Croissance', 'Amitié'],
        googleBookId: 'en_secret_garden'
      },
      {
        title: 'Little Women',
        author: 'Louisa May Alcott',
        totalPages: 448,
        language: 'en',
        genres: ['Fiction', 'Historique'],
        synopsis: 'The story of four sisters growing up during the Civil War.',
        ageRange: { min: 10, max: 16 },
        themes: ['Famille', 'Croissance', 'Féminisme'],
        googleBookId: 'en_little_women'
      },

      // Livres arabes
      {
        title: 'ألف ليلة وليلة',
        author: 'مجهول',
        totalPages: 800,
        language: 'ar',
        genres: ['Fiction', 'Folklorique'],
        synopsis: 'مجموعة من القصص الشعبية العربية القديمة.',
        ageRange: { min: 12, max: 18 },
        themes: ['ثقافة', 'تاريخ', 'خيال'],
        googleBookId: 'ar_alf_layla'
      },
      {
        title: 'كليلة ودمنة',
        author: 'ابن المقفع',
        totalPages: 200,
        language: 'ar',
        genres: ['Fable', 'Littérature jeunesse'],
        synopsis: 'مجموعة من الحكايات الأخلاقية مع الحيوانات.',
        ageRange: { min: 8, max: 14 },
        themes: ['أخلاق', 'حيوانات', 'حكمة'],
        googleBookId: 'ar_kalila_dimna'
      },
      {
        title: 'مغامرات سندباد',
        author: 'مجهول',
        totalPages: 150,
        language: 'ar',
        genres: ['Aventure', 'Littérature jeunesse'],
        synopsis: 'مغامرات البحار الشهير سندباد في البحار السبعة.',
        ageRange: { min: 8, max: 14 },
        themes: ['مغامرة', 'سفر', 'شجاعة'],
        googleBookId: 'ar_sindbad'
      },
      {
        title: 'الأمير الصغير',
        author: 'أنطوان دو سانت إكزوبيري',
        totalPages: 96,
        language: 'ar',
        genres: ['Fiction', 'Littérature jeunesse'],
        synopsis: 'قصة فلسفية عن الصداقة والحب.',
        ageRange: { min: 8, max: 12 },
        themes: ['صداقة', 'سفر', 'فلسفة'],
        googleBookId: 'ar_petit_prince'
      },
      {
        title: 'حكايات جدتي',
        author: 'مجهول',
        totalPages: 120,
        language: 'ar',
        genres: ['Folklorique', 'Littérature jeunesse'],
        synopsis: 'مجموعة من الحكايات الشعبية العربية التقليدية.',
        ageRange: { min: 6, max: 12 },
        themes: ['تراث', 'ثقافة', 'حكمة'],
        googleBookId: 'ar_grandmother_tales'
      },
      {
        title: 'مغامرات توم سوير',
        author: 'مارك توين',
        totalPages: 300,
        language: 'ar',
        genres: ['Aventure', 'Littérature jeunesse'],
        synopsis: 'مغامرات الصبي توم سوير في أمريكا القرن التاسع عشر.',
        ageRange: { min: 10, max: 16 },
        themes: ['مغامرة', 'طفولة', 'صداقة'],
        googleBookId: 'ar_tom_sawyer'
      }
    ];

    for (const bookData of bookTemplates) {
      const existing = await prisma.bookTemplate.findFirst({
        where: { googleBookId: bookData.googleBookId }
      });

      if (!existing) {
        await prisma.bookTemplate.create({
          data: bookData
        });
        console.log(`✅ Livre créé: ${bookData.title} (${bookData.language})`);
      } else {
        console.log(`⏭️ Livre existant: ${bookData.title} (${bookData.language})`);
      }
    }

    console.log('\n🎉 Seed terminé avec succès !');
    console.log(`📂 ${categories.length} catégories de base`);
    console.log(`📚 ${bookTemplates.length} templates de livres`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seed
seedCategoriesAndBooks()
  .then(() => {
    console.log('🎉 Seed complété !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec du seed:', error);
    process.exit(1);
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bookTemplates = [
  // Français (8 livres)
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    language: "fr",
    totalPages: 96,
    genres: ["Jeunesse", "Fantasy"],
    themes: ["amitié", "imagination", "voyage"],
    synopsis: "L'histoire d'un petit prince venu d'une autre planète qui rencontre un aviateur échoué dans le désert.",
    ageRange: { min: 7, max: 12 },
    googleBookId: "le-petit-prince-1943",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51bV7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Les Fables de La Fontaine",
    author: "Jean de La Fontaine",
    language: "fr",
    totalPages: 320,
    genres: ["Éducation", "Classique"],
    themes: ["morale", "animaux", "sagesse"],
    synopsis: "Collection de fables mettant en scène des animaux pour enseigner des leçons de vie.",
    ageRange: { min: 6, max: 14 },
    googleBookId: "fables-la-fontaine-1668",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Vingt Mille Lieues sous les Mers",
    author: "Jules Verne",
    language: "fr",
    totalPages: 448,
    genres: ["Science", "Aventure"],
    themes: ["exploration", "technologie", "mer"],
    synopsis: "L'aventure du capitaine Nemo et de son sous-marin le Nautilus.",
    ageRange: { min: 10, max: 16 },
    googleBookId: "vingt-mille-lieues-1870",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    language: "fr",
    totalPages: 1276,
    genres: ["Histoire", "Aventure"],
    themes: ["vengeance", "justice", "amour"],
    synopsis: "L'histoire d'Edmond Dantès, injustement emprisonné, qui s'évade et se venge.",
    ageRange: { min: 12, max: 18 },
    googleBookId: "comte-monte-cristo-1844",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    language: "fr",
    totalPages: 1463,
    genres: ["Histoire", "Drame"],
    themes: ["justice sociale", "rédemption", "amour"],
    synopsis: "L'histoire de Jean Valjean, ancien forçat, et sa quête de rédemption.",
    ageRange: { min: 14, max: 18 },
    googleBookId: "miserables-1862",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Le Tour du Monde en 80 Jours",
    author: "Jules Verne",
    language: "fr",
    totalPages: 256,
    genres: ["Aventure", "Voyage"],
    themes: ["défi", "amitié", "découverte"],
    synopsis: "Phileas Fogg parie qu'il peut faire le tour du monde en 80 jours.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "tour-monde-80-jours-1873",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "L'Île au Trésor",
    author: "Robert Louis Stevenson",
    language: "fr",
    totalPages: 292,
    genres: ["Aventure", "Pirates"],
    themes: ["trésor", "courage", "amitié"],
    synopsis: "Jim Hawkins part à la recherche d'un trésor de pirates sur une île mystérieuse.",
    ageRange: { min: 9, max: 15 },
    googleBookId: "ile-tresor-1883",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Les Aventures de Tintin",
    author: "Hergé",
    language: "fr",
    totalPages: 64,
    genres: ["Comics", "Aventure"],
    themes: ["mystère", "voyage", "amitié"],
    synopsis: "Les aventures du jeune reporter Tintin et de son chien Milou.",
    ageRange: { min: 7, max: 12 },
    googleBookId: "tintin-herge-1929",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },

  // Anglais (8 livres)
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    language: "en",
    totalPages: 223,
    genres: ["Fantasy", "Jeunesse"],
    themes: ["magic", "friendship", "courage"],
    synopsis: "A young wizard discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.",
    ageRange: { min: 9, max: 13 },
    googleBookId: "harry-potter-philosophers-stone-1997",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    language: "en",
    totalPages: 767,
    genres: ["Fantasy", "Aventure"],
    themes: ["magic", "good vs evil", "family"],
    synopsis: "Four siblings discover a magical world through a wardrobe in their uncle's house.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "chronicles-narnia-1950",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    language: "en",
    totalPages: 310,
    genres: ["Fantasy", "Aventure"],
    themes: ["journey", "courage", "friendship"],
    synopsis: "Bilbo Baggins, a hobbit, goes on an unexpected adventure with dwarves and a wizard.",
    ageRange: { min: 10, max: 16 },
    googleBookId: "hobbit-1937",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    language: "en",
    totalPages: 96,
    genres: ["Fantasy", "Jeunesse"],
    themes: ["imagination", "adventure", "nonsense"],
    synopsis: "Alice falls down a rabbit hole and enters a world of talking animals and playing cards.",
    ageRange: { min: 7, max: 12 },
    googleBookId: "alice-wonderland-1865",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    language: "en",
    totalPages: 331,
    genres: ["Jeunesse", "Drame"],
    themes: ["nature", "healing", "friendship"],
    synopsis: "Mary Lennox discovers a hidden garden and learns about the power of nature and friendship.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "secret-garden-1911",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    language: "en",
    totalPages: 292,
    genres: ["Aventure", "Pirates"],
    themes: ["treasure", "courage", "adventure"],
    synopsis: "Jim Hawkins embarks on a treasure hunt with pirates on a mysterious island.",
    ageRange: { min: 9, max: 15 },
    googleBookId: "treasure-island-1883",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "The Wind in the Willows",
    author: "Kenneth Grahame",
    language: "en",
    totalPages: 256,
    genres: ["Jeunesse", "Aventure"],
    themes: ["friendship", "nature", "adventure"],
    synopsis: "The adventures of Mole, Rat, Badger, and Toad in the English countryside.",
    ageRange: { min: 7, max: 12 },
    googleBookId: "wind-willows-1908",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "Peter Pan",
    author: "J.M. Barrie",
    language: "en",
    totalPages: 176,
    genres: ["Fantasy", "Jeunesse"],
    themes: ["adventure", "imagination", "childhood"],
    synopsis: "The story of Peter Pan, the boy who never grows up, and his adventures in Neverland.",
    ageRange: { min: 6, max: 12 },
    googleBookId: "peter-pan-1911",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },

  // Arabe (6 livres)
  {
    title: "كليلة ودمنة",
    author: "ابن المقفع",
    language: "ar",
    totalPages: 250,
    genres: ["Histoire", "Éducation"],
    themes: ["sagesse", "morale", "animaux"],
    synopsis: "مجموعة من القصص التعليمية التي تقدم دروساً أخلاقية من خلال حوارات الحيوانات.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "kalila-wa-dimna-750",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "ألف ليلة وليلة",
    author: "مجهول",
    language: "ar",
    totalPages: 1200,
    genres: ["Fantasy", "Histoire"],
    themes: ["aventure", "magie", "sagesse"],
    synopsis: "مجموعة من القصص الشرقية الشهيرة التي تحكيها شهرزاد للملك شهريار.",
    ageRange: { min: 10, max: 16 },
    googleBookId: "alf-layla-wa-layla-800",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "مغامرات سندباد",
    author: "مجهول",
    language: "ar",
    totalPages: 180,
    genres: ["Aventure", "Voyage"],
    themes: ["aventure", "voyage", "découverte"],
    synopsis: "قصص المغامرات البحرية للبحار الشهير سندباد في رحلاته السبع.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "sinbad-adventures-900",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "قصص الأنبياء",
    author: "ابن كثير",
    language: "ar",
    totalPages: 400,
    genres: ["Histoire", "Religion"],
    themes: ["sagesse", "histoire", "morale"],
    synopsis: "قصص الأنبياء والرسل كما وردت في القرآن الكريم والحديث الشريف.",
    ageRange: { min: 9, max: 16 },
    googleBookId: "qasas-al-anbiya-1300",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "حكايات شعبية عربية",
    author: "مجهول",
    language: "ar",
    totalPages: 200,
    genres: ["Folklore", "Éducation"],
    themes: ["traditions", "sagesse", "culture"],
    synopsis: "مجموعة من الحكايات الشعبية العربية التي تنقل القيم والأخلاق.",
    ageRange: { min: 7, max: 13 },
    googleBookId: "arabic-folktales-1800",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  },
  {
    title: "مغامرات في الصحراء",
    author: "أحمد شوقي",
    language: "ar",
    totalPages: 150,
    genres: ["Aventure", "Histoire"],
    themes: ["aventure", "nature", "courage"],
    synopsis: "قصص مغامرات في الصحراء العربية تروي حكايات الشجاعة والكرم.",
    ageRange: { min: 8, max: 14 },
    googleBookId: "desert-adventures-1900",
    coverImageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V7VkK1ZL._SX342_SY445_.jpg"
  }
];

async function main() {
  console.log('🌱 Seeding book templates...');
  
  for (const template of bookTemplates) {
    try {
      await prisma.bookTemplate.upsert({
        where: { 
          googleBookId: template.googleBookId || `manual-${template.title}` 
        },
        update: template,
        create: template
      });
      console.log(`✅ ${template.title} (${template.language})`);
    } catch (error) {
      console.error(`❌ Error seeding ${template.title}:`, error.message);
    }
  }
  
  console.log('🎉 Book templates seeded successfully!');
  console.log(`📚 Total: ${bookTemplates.length} templates`);
  console.log(`🇫🇷 French: ${bookTemplates.filter(t => t.language === 'fr').length}`);
  console.log(`🇬🇧 English: ${bookTemplates.filter(t => t.language === 'en').length}`);
  console.log(`🇸🇦 Arabic: ${bookTemplates.filter(t => t.language === 'ar').length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

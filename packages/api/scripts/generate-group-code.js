// Script pour générer des codes de groupe amusants
// Format: MOT1_MOT2_NUMERO (ex: PANDA_ROUX_305)

const generateGroupCode = () => {
  const animals = [
    'PANDA', 'LION', 'TIGRE', 'OURS', 'LAPIN', 'CHAT', 'CHIEN', 'POISSON', 
    'OISEAU', 'SINGE', 'ELEPHANT', 'GIRAFE', 'ZEBRE', 'RENARD', 'LOUP',
    'CERF', 'ECUREUIL', 'HAMSTER', 'COCHON', 'VACHE', 'CHEVAL', 'MOUTON'
  ];
  
  const colors = [
    'ROUX', 'BLEU', 'VERT', 'JAUNE', 'ROSE', 'VIOLET', 'ORANGE', 'ROUGE',
    'NOIR', 'BLANC', 'GRIS', 'MARRON', 'TURQUOISE', 'CORAL', 'LIME',
    'INDIGO', 'MAGENTA', 'CYAN', 'BEIGE', 'OR', 'ARGENT', 'CUIVRE'
  ];
  
  const numbers = [
    '101', '205', '307', '409', '512', '618', '724', '836', '942', '105',
    '213', '321', '435', '549', '657', '765', '873', '981', '109', '217'
  ];
  
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${animal}_${color}_${number}`;
};

// Fonction pour vérifier l'unicité du code
const isCodeUnique = async (code, prisma) => {
  const existingGroup = await prisma.group.findUnique({
    where: { code }
  });
  return !existingGroup;
};

// Fonction pour générer un code unique
const generateUniqueGroupCode = async (prisma) => {
  let code;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    code = generateGroupCode();
    attempts++;
    
    if (attempts >= maxAttempts) {
      // Si on n'arrive pas à générer un code unique, utiliser un timestamp
      code = `GROUP_${Date.now().toString().slice(-6)}`;
      break;
    }
  } while (!(await isCodeUnique(code, prisma)));
  
  return code;
};

export {
  generateGroupCode,
  generateUniqueGroupCode,
  isCodeUnique
};

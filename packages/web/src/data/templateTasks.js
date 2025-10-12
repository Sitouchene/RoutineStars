// Bibliothèque de tâches prédéfinies
export const TEMPLATE_TASKS = [
  // 🌞 Routine
  {
    id: 'routine-1',
    task: 'Se lever et faire son lit',
    category: 'routine',
    icon: '🛏️',
    points: 10,
    recurrence: 'daily',
    description: 'Commencer la journée en rangeant son lit et sa chambre.'
  },
  {
    id: 'routine-2',
    task: 'Prendre le petit déjeuner',
    category: 'routine',
    icon: '🍽️',
    points: 10,
    recurrence: 'daily',
    description: 'Prendre un petit déjeuner équilibré.'
  },
  {
    id: 'routine-3',
    task: 'Se laver et se brosser les dents',
    category: 'routine',
    icon: '🪥',
    points: 10,
    recurrence: 'daily',
    description: 'Hygiène du matin avant de commencer la journée.'
  },
  {
    id: 'routine-4',
    task: 'S\'habiller',
    category: 'routine',
    icon: '👕',
    points: 10,
    recurrence: 'daily',
    description: 'Choisir et enfiler des vêtements propres.'
  },
  {
    id: 'routine-5',
    task: 'Lire un livre avant de dormir',
    category: 'routine',
    icon: '📖',
    points: 10,
    recurrence: 'daily',
    description: 'Moment calme avant de se coucher.'
  },
  {
    id: 'routine-6',
    task: 'Se coucher à l\'heure',
    category: 'routine',
    icon: '🌙',
    points: 10,
    recurrence: 'daily',
    description: 'Aller dormir sans dépasser l\'heure fixée.'
  },

  // 🏠 Maison
  {
    id: 'household-1',
    task: 'Aider à mettre la table',
    category: 'household',
    icon: '🍴',
    points: 10,
    recurrence: 'daily',
    description: 'Préparer la table avant le repas.'
  },
  {
    id: 'household-2',
    task: 'Aider à débarrasser la table',
    category: 'household',
    icon: '🧺',
    points: 10,
    recurrence: 'daily',
    description: 'Ramener les assiettes et couverts après le repas.'
  },
  {
    id: 'household-3',
    task: 'Ranger ses jouets ou ses affaires',
    category: 'household',
    icon: '🧸',
    points: 10,
    recurrence: 'daily',
    description: 'Laisser la maison propre et bien rangée.'
  },
  {
    id: 'household-4',
    task: 'Donner à manger au chien',
    category: 'household',
    icon: '🐶',
    points: 10,
    recurrence: 'daily',
    description: 'Remplir la gamelle d\'eau et de nourriture.'
  },
  {
    id: 'household-5',
    task: 'Mettre le linge sale dans le panier',
    category: 'household',
    icon: '👕',
    points: 10,
    recurrence: 'daily',
    description: 'Aider à garder la chambre propre.'
  },
  {
    id: 'household-6',
    task: 'Plier ou ranger le linge propre',
    category: 'household',
    icon: '🧺',
    points: 15,
    recurrence: 'weekday',
    description: 'Aider après la lessive.'
  },

  // 📚 Études
  {
    id: 'study-1',
    task: 'Faire ses devoirs',
    category: 'study',
    icon: '📒',
    points: 20,
    recurrence: 'weekday',
    description: 'Finir les devoirs donnés à l\'école.'
  },
  {
    id: 'study-2',
    task: 'Lire un texte en français',
    category: 'study',
    icon: '🇫🇷',
    points: 15,
    recurrence: 'weekday',
    description: 'Améliorer la compréhension et le vocabulaire en français.'
  },
  {
    id: 'study-3',
    task: 'Regarder une vidéo ou lire un texte en anglais',
    category: 'study',
    icon: '🇬🇧',
    points: 15,
    recurrence: 'weekday',
    description: 'Pratiquer l\'anglais oral ou écrit.'
  },
  {
    id: 'study-4',
    task: 'Faire un exercice en arabe',
    category: 'study',
    icon: '🇸🇦',
    points: 15,
    recurrence: 'weekday',
    description: 'Lecture, écriture ou vocabulaire en arabe.'
  },
  {
    id: 'study-5',
    task: 'Coder un petit projet',
    category: 'study',
    icon: '💻',
    points: 25,
    recurrence: 'weekday',
    description: 'Apprendre la logique de programmation avec un petit exercice.'
  }
];

// Fonctions utilitaires pour les données
export const getTemplateTaskCategories = () => {
  const categories = [...new Set(TEMPLATE_TASKS.map(task => task.category))];
  return categories.sort();
};

export const searchTemplateTasks = (query, category = '') => {
  let filteredTasks = TEMPLATE_TASKS;

  // Filtrer par catégorie
  if (category) {
    filteredTasks = filteredTasks.filter(task => task.category === category);
  }

  // Rechercher par mot-clé
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.task.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    );
  }

  return filteredTasks;
};

export const getTemplateTaskById = (id) => {
  return TEMPLATE_TASKS.find(task => task.id === id);
};

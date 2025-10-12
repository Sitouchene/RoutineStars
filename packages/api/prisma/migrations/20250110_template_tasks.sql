-- Table pour les tâches prédéfinies
CREATE TABLE template_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  recurrence VARCHAR(20) NOT NULL DEFAULT 'daily',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertion des tâches prédéfinies
INSERT INTO template_tasks (task, category, icon, points, recurrence, description) VALUES
-- 🌞 Routine
('Se lever et faire son lit', 'routine', '🛏️', 10, 'daily', 'Commencer la journée en rangeant son lit et sa chambre.'),
('Prendre le petit déjeuner', 'routine', '🍽️', 10, 'daily', 'Prendre un petit déjeuner équilibré.'),
('Se laver et se brosser les dents', 'routine', '🪥', 10, 'daily', 'Hygiène du matin avant de commencer la journée.'),
('S''habiller', 'routine', '👕', 10, 'daily', 'Choisir et enfiler des vêtements propres.'),
('Lire un livre avant de dormir', 'routine', '📖', 10, 'daily', 'Moment calme avant de se coucher.'),
('Se coucher à l''heure', 'routine', '🌙', 10, 'daily', 'Aller dormir sans dépasser l''heure fixée.'),

-- 🏠 Maison
('Aider à mettre la table', 'household', '🍴', 10, 'daily', 'Préparer la table avant le repas.'),
('Aider à débarrasser la table', 'household', '🧺', 10, 'daily', 'Ramener les assiettes et couverts après le repas.'),
('Ranger ses jouets ou ses affaires', 'household', '🧸', 10, 'daily', 'Laisser la maison propre et bien rangée.'),
('Donner à manger au chien', 'household', '🐶', 10, 'daily', 'Remplir la gamelle d''eau et de nourriture.'),
('Mettre le linge sale dans le panier', 'household', '👕', 10, 'daily', 'Aider à garder la chambre propre.'),
('Plier ou ranger le linge propre', 'household', '🧺', 15, 'weekday', 'Aider après la lessive.'),

-- 📚 Études
('Faire ses devoirs', 'study', '📒', 20, 'weekday', 'Finir les devoirs donnés à l''école.'),
('Lire un texte en français', 'study', '🇫🇷', 15, 'weekday', 'Améliorer la compréhension et le vocabulaire en français.'),
('Regarder une vidéo ou lire un texte en anglais', 'study', '🇬🇧', 15, 'weekday', 'Pratiquer l''anglais oral ou écrit.'),
('Faire un exercice en arabe', 'study', '🇸🇦', 15, 'weekday', 'Lecture, écriture ou vocabulaire en arabe.'),
('Coder un petit projet', 'study', '💻', 25, 'weekday', 'Apprendre la logique de programmation avec un petit exercice.');

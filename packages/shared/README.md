# 📚 Shared Package - RoutineStars

Code partagé entre web, mobile (futur) et API.

## 🎯 Objectif

Centraliser tout le code réutilisable :
- ✅ Constantes (catégories, statuts, rôles...)
- ✅ Validateurs (Zod schemas)
- ✅ Types (JSDoc / TypeScript)
- ✅ Utilitaires communs

## 📦 Exports

### Constants

```javascript
import {
  TASK_CATEGORIES,
  TASK_ICONS,
  USER_ROLES,
  TASK_STATUS,
  TASK_RECURRENCE,
  EVALUATION_LEVELS,
  PROGRESS_COLORS,
} from 'shared/constants';

// Utilisation
console.log(TASK_CATEGORIES.ROUTINE); // 'routine'
console.log(TASK_ICONS[TASK_CATEGORIES.ROUTINE]); // '🌅'
```

### Validators (Zod)

```javascript
import {
  taskTemplateSchema,
  selfEvaluationSchema,
  parentValidationSchema,
  childSchema,
  parentSchema,
  loginParentSchema,
  loginChildSchema,
} from 'shared/validators';

// Utilisation (API)
const validatedData = taskTemplateSchema.parse(req.body);

// Utilisation (Frontend)
const result = childSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}
```

### Types (JSDoc)

```javascript
/**
 * @typedef {import('shared/types').User} User
 * @typedef {import('shared/types').Task} Task
 */

/**
 * @param {User} user
 * @returns {string}
 */
function getUserName(user) {
  return user.name;
}
```

## 🔧 Structure

```
shared/
├── constants/
│   └── index.js       # Toutes les constantes
├── validators/
│   └── index.js       # Tous les schemas Zod
├── types/
│   └── index.js       # Types JSDoc
└── index.js           # Export principal
```

## 📝 Constantes disponibles

### TASK_CATEGORIES
```javascript
{
  ROUTINE: 'routine',
  MAISON: 'maison',
  ETUDES: 'etudes',
}
```

### TASK_ICONS
```javascript
{
  routine: '🌅',
  maison: '🏠',
  etudes: '📚',
}
```

### USER_ROLES
```javascript
{
  PARENT: 'parent',
  CHILD: 'child',
}
```

### TASK_STATUS
```javascript
{
  ASSIGNED: 'assigned',           // 🟨 Attribuée
  SELF_EVALUATED: 'self_evaluated', // 🟦 Autoévaluée
  VALIDATED: 'validated',          // 🟩 Validée
}
```

### TASK_RECURRENCE
```javascript
{
  DAILY: 'daily',
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
  MONDAY: 'monday',
  // ... tous les jours
}
```

### EVALUATION_LEVELS
```javascript
{
  NOT_DONE: 0,
  PARTIALLY_DONE: 50,
  FULLY_DONE: 100,
}
```

### PROGRESS_COLORS
```javascript
{
  RED: { min: 0, max: 25, color: '#ef4444' },
  ORANGE: { min: 26, max: 50, color: '#f97316' },
  YELLOW: { min: 51, max: 75, color: '#eab308' },
  GREEN: { min: 76, max: 100, color: '#22c55e' },
}
```

## ✅ Validateurs disponibles

### taskTemplateSchema
```javascript
{
  title: string (1-100 caractères),
  category: enum (routine | maison | etudes),
  icon?: string,
  points: number (1-100, défaut: 5),
  recurrence: enum (daily | weekday | ...),
  description?: string (max 500),
}
```

### childSchema
```javascript
{
  name: string (1-50 caractères),
  age: number (3-18),
  avatar?: string (URL),
  pin: string (4 chiffres),
}
```

### selfEvaluationSchema
```javascript
{
  taskId: string (UUID),
  score: number (0-100),
}
```

### parentValidationSchema
```javascript
{
  taskId: string (UUID),
  score: number (0-100),
  comment?: string (max 500),
}
```

## 🔄 Utilisation dans le monorepo

### Dans l'API
```javascript
// packages/api/src/modules/tasks/tasks.controller.js
import { taskTemplateSchema } from 'shared/validators';
import { TASK_CATEGORIES } from 'shared/constants';

const validated = taskTemplateSchema.parse(req.body);
```

### Dans le Web
```javascript
// packages/web/src/components/TaskCard.jsx
import { TASK_ICONS } from 'shared/constants';

export function TaskCard({ task }) {
  return <span>{TASK_ICONS[task.category]}</span>;
}
```

### Dans le Mobile (futur)
```javascript
// packages/mobile/src/components/TaskCard.tsx
import { TASK_ICONS } from 'shared/constants';

export const TaskCard = ({ task }) => (
  <Text>{TASK_ICONS[task.category]}</Text>
);
```

## 🚀 Ajouter de nouvelles constantes

1. Éditer `constants/index.js`
2. Exporter la nouvelle constante
3. Utilisable partout immédiatement !

```javascript
// constants/index.js
export const NEW_CONSTANT = {
  VALUE: 'value',
};
```

## 🔄 Ajouter des validateurs

1. Éditer `validators/index.js`
2. Créer le schema Zod
3. Exporter

```javascript
// validators/index.js
export const newSchema = z.object({
  field: z.string(),
});
```

## 📚 Évolution vers TypeScript

Si besoin de TypeScript plus tard :

1. Renommer les fichiers `.js` en `.ts`
2. Remplacer JSDoc par types TS
3. Configurer `tsconfig.json`
4. Build avec `tsc`

Le code reste compatible !



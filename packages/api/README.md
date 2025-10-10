# 🔧 API RoutineStars

Backend Express + Prisma pour l'application RoutineStars.

## 🏗️ Architecture

### Structure modulaire

```
src/
├── config/              # Configuration
│   ├── database.js     # Client Prisma
│   └── jwt.js          # Utilitaires JWT
├── middlewares/         # Middlewares Express
│   ├── auth.middleware.js
│   └── errorHandler.js
├── modules/             # Modules métier
│   ├── auth/           # Authentification
│   ├── children/       # Gestion des enfants
│   ├── tasks/          # (à venir)
│   └── rewards/        # (à venir)
└── routes/             # Routes principales
    └── index.js
```

### Schéma de base de données

**Modèles Prisma :**
- `Family` : Compte famille
- `User` : Parents et enfants
- `TaskTemplate` : Modèles de tâches
- `Task` : Tâches assignées quotidiennes
- `Reward` : Récompenses et badges

## 🚀 API Endpoints

### Authentification

#### POST `/api/auth/parent/register`
Créer un compte parent (+ famille)

```json
{
  "email": "papa@exemple.fr",
  "password": "motdepasse123",
  "name": "Jean Dupont"
}
```

Réponse :
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "Jean Dupont",
    "email": "papa@exemple.fr",
    "role": "parent",
    "familyId": "uuid"
  }
}
```

#### POST `/api/auth/parent/login`
Connexion parent

```json
{
  "email": "papa@exemple.fr",
  "password": "motdepasse123"
}
```

#### POST `/api/auth/child/login`
Connexion enfant avec PIN

```json
{
  "childId": "uuid",
  "pin": "1234"
}
```

### Enfants (🔒 Auth Parent requise)

#### GET `/api/children`
Liste des enfants de la famille

Headers :
```
Authorization: Bearer <token>
```

#### POST `/api/children`
Créer un enfant

```json
{
  "name": "Samir",
  "age": 7,
  "pin": "1234",
  "avatar": "https://..."
}
```

#### PUT `/api/children/:id`
Modifier un enfant

```json
{
  "name": "Samir Dupont",
  "age": 8,
  "pin": "5678"
}
```

#### DELETE `/api/children/:id`
Supprimer un enfant

## 🔐 Authentification

### JWT Token

Le token contient :
```json
{
  "userId": "uuid",
  "familyId": "uuid",
  "role": "parent" | "child"
}
```

### Middlewares

- `authenticate` : Vérifie le token JWT
- `requireParent` : Vérifie le rôle parent
- `requireChild` : Vérifie le rôle enfant

Utilisation :
```javascript
router.get('/parent-only', authenticate, requireParent, controller);
```

## 🗃️ Prisma

### Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la DB
npx prisma db push

# Ouvrir Prisma Studio
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration
```

### Utilisation

```javascript
import prisma from '../config/database.js';

// Créer un enfant
const child = await prisma.user.create({
  data: {
    familyId: 'uuid',
    role: 'child',
    name: 'Samir',
    age: 7,
  }
});

// Requête avec relation
const family = await prisma.family.findUnique({
  where: { id: 'uuid' },
  include: {
    users: true,
    taskTemplates: true,
  }
});
```

## 📦 Dépendances principales

- `express` : Framework web
- `@prisma/client` : ORM
- `jsonwebtoken` : JWT
- `bcryptjs` : Hash de mots de passe
- `zod` : Validation (depuis shared)
- `cors` : CORS
- `helmet` : Sécurité HTTP
- `morgan` : Logs HTTP

## 🧪 Tests (à venir)

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

## 🔒 Sécurité

### Bonnes pratiques implémentées

✅ Mots de passe hashés avec bcrypt (10 rounds)
✅ JWT avec expiration (24h par défaut)
✅ Validation des données avec Zod
✅ CORS configuré
✅ Helmet pour headers sécurisés
✅ Pas de secrets en dur (variables d'environnement)

### À ajouter en production

- [ ] Rate limiting (express-rate-limit)
- [ ] HTTPS obligatoire
- [ ] Refresh tokens
- [ ] Logs structurés (Winston)
- [ ] Monitoring (Sentry)



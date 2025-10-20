# 🔧 API mOOtify (routinestars)

Backend Express + Prisma pour l'application mOOtify - Système complet de gestion de routines et tâches pour enfants avec badges, récompenses et lectures.

> *Chaque effort compte* ✨

## 🏗️ Architecture

### Structure modulaire complète

```
src/
├── config/              # Configuration
│   ├── database.js     # Client Prisma
│   └── jwt.js          # Utilitaires JWT
├── middlewares/         # Middlewares Express
│   ├── auth.middleware.js
│   └── errorHandler.js
├── modules/             # Modules métier (20+ modules)
│   ├── auth/           # Authentification
│   ├── children/       # Gestion des enfants/élèves
│   ├── groups/         # Gestion des groupes (familles/classes)
│   ├── tasks/          # Templates et tâches
│   ├── assignments/    # Assignations de tâches
│   ├── submissions/    # Soumissions quotidiennes
│   ├── categories/     # Catégories de tâches
│   ├── books/          # Gestion bibliothèque
│   ├── reading/        # Assignations et progrès lecture
│   ├── awards/         # Badges et récompenses
│   ├── points/         # Système de points
│   ├── quiz/           # Quiz de lecture
│   ├── stats/          # Statistiques
│   ├── messages/       # Messages quotidiens
│   └── evalWindow/     # Fenêtres d'évaluation
└── routes/             # Routes principales
    └── index.js
```

### Schéma de base de données

**Modèles Prisma principaux :**
- `Group` : Groupe (famille/classe) avec code unique
- `User` : Utilisateurs (parents/enseignants et enfants/élèves)
- `Category` : Catégories de tâches (système + personnalisées)
- `TaskTemplate` : Modèles de tâches réutilisables
- `Task` : Tâches assignées quotidiennes avec scores
- `TaskAssignment` : Assignations de tâches aux enfants
- `DaySubmission` : Soumissions quotidiennes avec validation
- `Book` : Bibliothèque de livres du groupe
- `ReadingAssignment` : Assignations de lecture
- `ReadingProgress` : Progression dans les lectures
- `ReadingQuiz` : Quiz interactifs par livre
- `GlobalBadge` / `GroupBadge` : Système de badges
- `GlobalReward` / `GroupReward` : Système de récompenses
- `PointTransaction` : Historique des points
- `DailyMessage` : Messages quotidiens parent-enfant
- `EvaluationWindow` : Fenêtres d'évaluation

## 🚀 API Endpoints

### 📋 Vue d'ensemble

L'API mOOtify propose **100+ endpoints** organisés en modules :

- **Authentification** : `/auth` (5 endpoints)
- **Groupes** : `/groups` (8 endpoints) 
- **Enfants** : `/children` (6 endpoints)
- **Catégories** : `/categories` (7 endpoints)
- **Tâches** : `/tasks` (8 endpoints)
- **Assignations** : `/assignments` (6 endpoints)
- **Soumissions** : `/submissions` (5 endpoints)
- **Livres** : `/books` (8 endpoints)
- **Lectures** : `/reading` (5 endpoints)
- **Badges** : `/badges` (10 endpoints)
- **Récompenses** : `/rewards` (10 endpoints)
- **Points** : `/points` (6 endpoints)
- **Quiz** : `/quiz` (6 endpoints)
- **Statistiques** : `/stats` (4 endpoints)
- **Messages** : `/messages` (5 endpoints)
- **Fenêtres d'évaluation** : `/eval-window` (4 endpoints)

### 🔑 Authentification

#### POST `/auth/register`
Créer un compte parent/enseignant

```json
{
  "email": "parent@exemple.fr",
  "password": "motdepasse123",
  "name": "Jean Dupont",
  "role": "parent"
}
```

#### POST `/auth/login`
Connexion parent/enseignant

#### POST `/auth/login-child`
Connexion enfant/élève avec code groupe + PIN ou QR code

**Body:**
```json
{
  "groupId": "ABC123",
  "childId": "uuid",
  "pin": "1234"
}
```

**Ou via QR Code :**
Le QR code contient le code de groupe qui est extrait automatiquement lors du scan.

### 👥 Groupes

#### POST `/groups` 🔒
Créer un groupe (famille/classe)

#### GET `/groups/code/:code`
Récupérer un groupe par code (public)

#### GET `/groups/:groupId/dashboard-stats` 🔒
Statistiques du dashboard

### 👶 Enfants

#### POST `/children` 🔒👨‍👩‍👧‍👦
Créer un enfant/élève

#### GET `/children` 🔒👨‍👩‍👧‍👦
Liste des enfants du groupe

#### PUT `/children/:id/avatar` 🔒
Mettre à jour l'avatar

### 📚 Livres et Lectures

#### GET `/books/search/google`
Rechercher des livres sur Google Books

#### POST `/books/import/google/:googleBookId` 🔒👨‍👩‍👧‍👦
Importer un livre depuis Google Books

#### POST `/reading/assign` 🔒👨‍👩‍👧‍👦
Assigner une lecture

#### PUT `/reading/:id/progress` 🔒👶
Mettre à jour la progression de lecture

### 🏆 Badges et Récompenses

#### GET `/badges/global`
Liste des badges globaux (public)

#### POST `/badges/group/:groupId/custom` 🔒👨‍👩‍👧‍👦
Créer un badge personnalisé

#### POST `/rewards/user/:userId/redeem` 🔒👶
Échanger une récompense

### 🧠 Quiz de Lecture

#### GET `/quiz/book/:bookId/trigger/:currentPage`
Quiz déclenché à une page (public)

#### POST `/quiz/attempt` 🔒👶
Soumettre un quiz

### 📊 Statistiques

#### GET `/stats/child/:childId/daily/:date` 🔒👨‍👩‍👧‍👦
Statistiques quotidiennes

#### GET `/stats/group/:startDate/:endDate` 🔒👨‍👩‍👧‍👦
Statistiques du groupe

> **📖 Documentation complète** : Voir `API_DOCUMENTATION.md` pour tous les endpoints détaillés

## 🔐 Authentification

### JWT Token

Le token contient :
```json
{
  "userId": "uuid",
  "groupId": "uuid",
  "role": "parent" | "teacher" | "child" | "student"
}
```

### Middlewares

- `authenticate` : Vérifie le token JWT
- `requireParentOrTeacher` : Vérifie le rôle parent ou enseignant
- `requireChildOrStudent` : Vérifie le rôle enfant ou élève

Utilisation :
```javascript
router.get('/admin-only', authenticate, requireParentOrTeacher, controller);
router.post('/child-action', authenticate, requireChildOrStudent, controller);
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
    groupId: 'uuid',
    role: 'child',
    name: 'Samir',
    age: 7,
    pin: '1234'
  }
});

// Requête avec relations
const group = await prisma.group.findUnique({
  where: { id: 'uuid' },
  include: {
    users: true,
    taskTemplates: true,
    books: true,
    groupBadges: true,
    groupRewards: true
  }
});

// Créer une assignation de lecture
const readingAssignment = await prisma.readingAssignment.create({
  data: {
    bookId: 'uuid',
    childId: 'uuid',
    assignedById: 'uuid',
    assignmentType: 'reading',
    totalPoints: 50
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

## 🌍 Internationalisation et Multiculturalisme

### Langues Supportées
- **Français** : Langue principale
- **Anglais** : Version complète
- **Arabe** : Interface traduite

### Cultures Adaptées
- **🇩🇿 Algérie** : Calendrier scolaire, jours fériés, références culturelles
- **🇨🇦 Canada (FR)** : Système scolaire québécois, vacances canadiennes
- **🇨🇦 Canada (EN)** : Système scolaire anglophone, références culturelles
- **🇫🇷 France** : Calendrier scolaire français, jours fériés nationaux

### Contenu Localisé
- **Livres** : Sélection adaptée à chaque culture
- **Tâches** : Exemples et références culturelles
- **Calendriers** : Vacances scolaires et jours fériés
- **Messages** : Encouragements adaptés culturellement

## 🎨 Système de Thèmes

### Thème Principal
- **Couleurs** : Vert menthe (#58D6A8) et violet (#B69CF4)
- **Style** : Moderne et bienveillant
- **Usage** : Interface par défaut

### Thème Aventurier
- **Couleurs** : Bleu ciel (#38bdf8) et turquoise (#14b8a6)
- **Style** : Dynamique et explorateur
- **Usage** : Pour les enfants aventuriers
- **Personnalité** : Énergique, curieux, explorateur

### Thème Créatif
- **Couleurs** : Rose (#fb7185) et rose clair (#f9a8d4)
- **Style** : Artistique et imaginatif
- **Usage** : Pour les enfants créatifs
- **Personnalité** : Inspirant, coloré, expressif

## 📦 Dépendances principales

- `express` : Framework web
- `@prisma/client` : ORM
- `jsonwebtoken` : JWT
- `bcryptjs` : Hash de mots de passe
- `zod` : Validation (depuis shared)
- `cors` : CORS
- `helmet` : Sécurité HTTP
- `morgan` : Logs HTTP
- `axios` : Requêtes HTTP (Google Books API)

## 🧪 Tests

```bash
# Unit tests
pnpm test

# Tests d'intégration
pnpm test:integration

# Tests E2E
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
✅ Middlewares de permissions par rôle
✅ Validation des entrées utilisateur

### À ajouter en production

- [ ] Rate limiting (express-rate-limit)
- [ ] HTTPS obligatoire
- [ ] Refresh tokens
- [ ] Logs structurés (Winston)
- [ ] Monitoring (Sentry)
- [ ] Validation des fichiers uploadés
- [ ] Sanitisation des données

## 📊 Performance

### Optimisations implémentées

- Indexes Prisma sur les champs fréquemment utilisés
- Requêtes optimisées avec `include` et `select`
- Cache des données statiques (badges globaux)
- Pagination sur les listes longues
- Compression des réponses

### Métriques

- **Endpoints** : 100+ endpoints REST
- **Modules** : 20+ modules métier
- **Modèles** : 25+ modèles Prisma
- **Temps de réponse** : < 200ms (moyenne)
- **Disponibilité** : 99.9% (objectif)

## 🚀 Déploiement

### Variables d'environnement requises

```bash
# Base de données
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="24h"

# Google Books API (optionnel)
GOOGLE_BOOKS_API_KEY="your-api-key"

# Supabase (optionnel)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

### Commandes de déploiement

```bash
# Build
pnpm build

# Migration base de données
pnpm db:push

# Démarrage production
pnpm start
```

---

**Développé avec ❤️ par l'équipe mOOtify pour aider les familles et enseignants à mieux s'organiser**

*Chaque effort compte* ✨



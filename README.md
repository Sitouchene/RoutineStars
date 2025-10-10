# ⭐ RoutineStars

Application de gestion de routines et tâches pour enfants avec système de récompenses et d'autoévaluation.

## 🎯 Concept

RoutineStars aide les enfants à :
- ✅ Adopter une routine saine quotidienne
- 🏠 Participer aux tâches ménagères
- 📚 Développer leur autonomie dans les études
- 🎖️ S'autoévaluer et être récompensés

Les parents peuvent :
- 👨‍👩‍👧 Créer et gérer plusieurs profils enfants
- 📋 Définir des tâches récurrentes par catégorie
- ✓ Valider et encourager les efforts
- 📊 Suivre les progrès et statistiques

## 🏗️ Architecture

### Monorepo Structure

```
routinestars/
├── packages/
│   ├── api/          # Backend Express + Prisma
│   ├── web/          # Frontend PWA (Vite + React)
│   └── shared/       # Code partagé (constantes, validators)
└── pnpm-workspace.yaml
```

### Stack Technique

**Backend (API)**
- Node.js + Express
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- JavaScript (ES Modules)

**Frontend (Web PWA)**
- React 18
- Vite
- Tailwind CSS
- Zustand (state)
- React Query (cache)
- React Router

**Shared**
- Zod (validation)
- Constantes communes
- Types partagés

## 🚀 Installation

### Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org))
- pnpm ([installer](https://pnpm.io/installation))
- PostgreSQL ou compte Supabase gratuit ([créer](https://supabase.com))

### 1. Cloner et installer

```bash
# Cloner le repo
git clone <votre-repo>
cd routinestars

# Installer toutes les dépendances
pnpm install
```

### 2. Configuration de la base de données

**Option A : Supabase (Recommandé)**

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier l'URL de connexion PostgreSQL
4. Créer `.env` dans `packages/api/`

```bash
cd packages/api
cp ENV_EXAMPLE.md .env
# Éditer .env avec vos informations Supabase
```

**Option B : PostgreSQL local**

```bash
# Créer la base de données
createdb routinestars

# Configurer .env avec votre URL locale
DATABASE_URL="postgresql://user:password@localhost:5432/routinestars"
```

### 3. Initialiser Prisma

```bash
# Depuis la racine du projet
pnpm db:push
```

Cette commande va :
- Créer toutes les tables dans votre base de données
- Générer le client Prisma

### 4. Configuration Frontend

```bash
cd packages/web
# Créer le fichier .env
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

## 🎬 Lancer l'application

### Développement (tout en parallèle)

```bash
# Depuis la racine
pnpm dev
```

Cela lance :
- API sur http://localhost:3001
- Web sur http://localhost:5173

### Développement séparé

```bash
# Terminal 1 - API
pnpm dev:api

# Terminal 2 - Web
pnpm dev:web
```

### Base de données

```bash
# Ouvrir Prisma Studio (interface visuelle)
pnpm db:studio

# Pousser les changements de schéma
pnpm db:push
```

## 📚 Utilisation

### 1. Créer un compte parent

1. Ouvrir http://localhost:5173
2. Cliquer sur "Mode Parent"
3. S'inscrire avec email + mot de passe
4. Se connecter

### 2. Ajouter un enfant

1. Aller dans "Enfants"
2. Créer un profil :
   - Prénom
   - Âge
   - Code PIN (4 chiffres)
   - Photo (optionnel)

### 3. Créer des tâches

1. Aller dans "Tâches"
2. Créer une tâche template :
   - Titre (ex: "Ranger ma chambre")
   - Catégorie (Routine / Maison / Études)
   - Points (1-100)
   - Récurrence (quotidien, semaine, weekend...)

### 4. Connexion enfant

1. Retour à la page de login
2. "Mode Enfant"
3. Sélectionner le profil
4. Entrer le code PIN

## 🔐 Authentification

### Parent
- Email + mot de passe sécurisé
- Token JWT (24h)
- Accès complet à l'administration

### Enfant
- Code PIN 4 chiffres
- Token JWT avec permissions limitées
- Accès uniquement à son espace personnel

## 📁 Structure du code

### Backend (packages/api)

```
src/
├── config/           # Configuration (DB, JWT)
├── middlewares/      # Auth, erreurs
├── modules/          # Modules métier
│   ├── auth/        # Authentification
│   ├── children/    # Gestion enfants
│   ├── tasks/       # (à venir)
│   └── rewards/     # (à venir)
└── routes/          # Routes principales
```

### Frontend (packages/web)

```
src/
├── components/      # Composants UI
├── lib/            # Utils, API client
├── pages/          # Pages React
│   ├── parent/     # Interface parent
│   └── child/      # Interface enfant
└── stores/         # Zustand stores
```

### Shared (packages/shared)

```
├── constants/      # Constantes (catégories, statuts...)
├── validators/     # Validation Zod
└── types/          # Types JSDoc
```

## 🛠️ Scripts disponibles

```bash
# Développement
pnpm dev              # Tout en parallèle
pnpm dev:api          # API seulement
pnpm dev:web          # Web seulement

# Base de données
pnpm db:push          # Appliquer le schéma
pnpm db:studio        # Interface visuelle

# Build
pnpm build            # Build API + Web

# Production
pnpm start:api        # Lancer l'API
pnpm start:web        # Preview du build web
```

## 🚀 Déploiement

### Backend (Railway recommandé)

1. Créer un compte sur [railway.app](https://railway.app)
2. Installer Railway CLI :
   ```bash
   npm i -g @railway/cli
   ```
3. Déployer :
   ```bash
   cd packages/api
   railway login
   railway init
   railway up
   ```
4. Ajouter les variables d'environnement dans Railway

### Frontend (Vercel recommandé)

1. Installer Vercel CLI :
   ```bash
   npm i -g vercel
   ```
2. Déployer :
   ```bash
   cd packages/web
   vercel --prod
   ```
3. Configurer `VITE_API_URL` avec l'URL Railway

## 🔮 Prochaines fonctionnalités

- [ ] Module de tâches complètes (CRUD)
- [ ] Système d'autoévaluation enfant
- [ ] Validation parent avec commentaires
- [ ] Génération automatique des tâches quotidiennes
- [ ] Système de récompenses et badges
- [ ] Statistiques et graphiques
- [ ] Notifications (web push)
- [ ] Mode hors ligne (PWA)
- [ ] Application mobile React Native

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📄 Licence

MIT

---

**Développé avec ❤️ pour aider les familles à mieux s'organiser**



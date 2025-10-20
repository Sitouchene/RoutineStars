# ⭐ RoutineStars

Application complète de gestion de routines et tâches pour enfants avec système de récompenses, badges, lectures et quiz interactifs.

## 🎯 Concept

RoutineStars aide les enfants à :
- ✅ Adopter une routine saine quotidienne
- 🏠 Participer aux tâches ménagères
- 📚 Développer leur autonomie dans les études
- 🎖️ S'autoévaluer et être récompensés
- 📖 Progresser dans leurs lectures avec quiz interactifs
- 🏆 Collectionner des badges et échanger des récompenses

Les parents peuvent :
- 👨‍👩‍👧 Créer et gérer plusieurs profils enfants
- 📋 Définir des tâches récurrentes par catégorie
- ✓ Valider et encourager les efforts
- 📊 Suivre les progrès et statistiques
- 📚 Gérer une bibliothèque de livres et assigner des lectures
- 🎁 Créer des badges personnalisés et des récompenses
- 🏫 Utiliser le système en famille ou en classe

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
- Système de groupes (familles/classes)
- API REST complète avec 20+ modules

**Frontend (Web PWA)**
- React 18
- Vite
- Tailwind CSS
- Zustand (state management)
- React Query (cache & API)
- React Router
- Framer Motion (animations)
- i18next (internationalisation)
- PWA avec service worker

**Shared**
- Zod (validation)
- Constantes communes
- Types partagés
- Validation centralisée

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

### 1. Créer un compte parent/enseignant

1. Ouvrir http://localhost:5173
2. Cliquer sur "Mode Parent/Enseignant"
3. S'inscrire avec email + mot de passe
4. Se connecter

### 2. Configurer le groupe

1. Le système crée automatiquement un groupe
2. Noter le code de groupe (ex: ABC123)
3. Configurer les paramètres (langue, pays)

### 3. Ajouter des enfants/élèves

1. Aller dans "Enfants"
2. Créer un profil :
   - Prénom
   - Âge
   - Code PIN (4 chiffres)
   - Photo (optionnel)

### 4. Créer des catégories et tâches

1. Aller dans "Catégories" pour créer des catégories personnalisées
2. Aller dans "Tâches" pour créer des templates :
   - Titre (ex: "Ranger ma chambre")
   - Catégorie (Routine / Maison / Études)
   - Points (1-100)
   - Récurrence (quotidien, semaine, weekend...)

### 5. Assigner des tâches

1. Aller dans "Assignations"
2. Assigner des tâches aux enfants
3. Configurer les récurrences et dates

### 6. Gérer la bibliothèque

1. Aller dans "Gestion Livres"
2. Importer des livres depuis Google Books
3. Assigner des lectures aux enfants
4. Suivre les progrès de lecture

### 7. Système de récompenses

1. Aller dans "Badges" pour créer des badges personnalisés
2. Aller dans "Récompenses" pour créer des récompenses
3. Les enfants peuvent échanger leurs points contre des récompenses

### 8. Connexion enfant/élève

1. Retour à la page de login
2. "Mode Enfant/Élève"
3. Entrer le code de groupe
4. Sélectionner le profil
5. Entrer le code PIN

## 🔐 Authentification

### Parent/Enseignant
- Email + mot de passe sécurisé
- Token JWT (24h)
- Accès complet à l'administration
- Gestion du groupe (famille/classe)

### Enfant/Élève
- Code de groupe + code PIN 4 chiffres
- Token JWT avec permissions limitées
- Accès uniquement à son espace personnel
- Interface adaptée aux enfants

## 📁 Structure du code

### Backend (packages/api)

```
src/
├── config/           # Configuration (DB, JWT)
├── middlewares/      # Auth, erreurs
├── modules/          # Modules métier (20+ modules)
│   ├── auth/        # Authentification
│   ├── children/    # Gestion enfants/élèves
│   ├── groups/      # Gestion groupes (familles/classes)
│   ├── tasks/       # Templates et tâches
│   ├── assignments/ # Assignations de tâches
│   ├── submissions/ # Soumissions quotidiennes
│   ├── categories/  # Catégories de tâches
│   ├── books/       # Gestion bibliothèque
│   ├── reading/     # Assignations et progrès lecture
│   ├── awards/      # Badges et récompenses
│   ├── points/      # Système de points
│   ├── quiz/        # Quiz de lecture
│   ├── stats/       # Statistiques
│   ├── messages/    # Messages quotidiens
│   └── evalWindow/  # Fenêtres d'évaluation
└── routes/          # Routes principales
```

### Frontend (packages/web)

```
src/
├── components/      # Composants UI réutilisables
│   ├── parent/      # Composants interface parent
│   ├── child/       # Composants interface enfant
│   ├── awards/      # Composants badges/récompenses
│   ├── quiz/        # Composants quiz
│   ├── branding/    # Logo, mascottes
│   └── ui/          # Composants UI de base
├── lib/            # Utils, API client, Supabase
├── pages/           # Pages React
│   ├── parent/      # Interface parent/enseignant (16 pages)
│   └── child/       # Interface enfant/élève (8 pages)
├── stores/          # Zustand stores (auth, navigation, theme)
├── locales/         # Traductions (FR, EN, AR)
├── hooks/           # Hooks personnalisés
└── services/        # Services (auth, API)
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

## 🔮 Fonctionnalités actuelles

### ✅ Implémentées

- **Authentification complète** : Parents/enseignants et enfants/élèves
- **Gestion des groupes** : Système famille/classe avec codes
- **Tâches et assignations** : Templates, récurrences, assignations
- **Système de points** : Attribution, historique, transactions
- **Badges et récompenses** : Création, attribution, échange
- **Bibliothèque de livres** : Import Google Books, gestion locale
- **Lectures assignées** : Progression, quiz interactifs
- **Quiz de lecture** : Questions par page, scoring
- **Statistiques** : Dashboard, graphiques, historique
- **Messages quotidiens** : Communication parent-enfant
- **Interface multilingue** : Français, Anglais, Arabe
- **PWA** : Installation mobile, mode hors ligne
- **Responsive** : Mobile-first, tablette, desktop

### 🚧 En développement

- [ ] Notifications push
- [ ] Mode hors ligne avancé
- [ ] Export/import de données
- [ ] Rapports PDF
- [ ] Intégration calendrier

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📄 Licence

MIT

---

**Développé avec ❤️ pour aider les familles à mieux s'organiser**



# Plan d'Implémentation du Système Awards/Badges

## 🎯 Objectif
Implémenter un système complet de récompenses, badges et conversion de points en récompenses pour motiver les enfants.

## 🏆 Architecture du Système

### 1. Modèles de Données

#### Badge Model
```prisma
model Badge {
  id          String   @id @default(cuid())
  name        String
  description String
  icon        String   // Emoji ou URL d'icône
  category    String   // "reading", "tasks", "streak", "special"
  rarity      String   // "common", "rare", "epic", "legendary"
  pointsRequired Int   // Points nécessaires pour débloquer
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userBadges  UserBadge[]
  groupBadges GroupBadge[]
}
```

#### UserBadge Model
```prisma
model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  badgeId   String
  earnedAt  DateTime @default(now())
  isVisible Boolean  @default(true)
  
  // Relations
  user      User     @relation(fields: [userId], references: [id])
  badge     Badge    @relation(fields: [badgeId], references: [id])
  
  @@unique([userId, badgeId])
}
```

#### Reward Model
```prisma
model Reward {
  id          String   @id @default(cuid())
  name        String
  description String
  icon        String
  category    String   // "virtual", "physical", "privilege"
  pointsCost  Int      // Coût en points
  isActive    Boolean  @default(true)
  maxQuantity Int?     // Limite par utilisateur
  groupId     String?  // Récompense spécifique au groupe
  
  // Relations
  group       Group?   @relation(fields: [groupId], references: [id])
  redemptions RewardRedemption[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### RewardRedemption Model
```prisma
model RewardRedemption {
  id        String   @id @default(cuid())
  userId    String
  rewardId  String
  pointsSpent Int
  status    String   // "pending", "approved", "denied", "fulfilled"
  redeemedAt DateTime @default(now())
  approvedAt DateTime?
  fulfilledAt DateTime?
  notes     String?
  
  // Relations
  user      User     @relation(fields: [userId], references: [id])
  reward    Reward   @relation(fields: [rewardId], references: [id])
}
```

### 2. Système de Points Avancé

#### PointTransaction Model
```prisma
model PointTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int      // Positif pour gain, négatif pour dépense
  type        String   // "task_completion", "reading_progress", "badge_earned", "reward_purchase"
  sourceId    String?  // ID de la tâche, lecture, badge, etc.
  description String
  createdAt   DateTime @default(now())
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🎮 Fonctionnalités Principales

### 1. Système de Badges

#### Types de Badges
- **📚 Lecture**: Pages lues, livres terminés, série de lecture
- **🎯 Tâches**: Tâches complétées, série de réussite
- **🔥 Série**: Connexions consécutives, tâches quotidiennes
- **⭐ Spéciaux**: Première connexion, anniversaire, événements

#### Logique de Déblocage
```javascript
// Exemples de badges automatiques
const badgeRules = {
  "first_login": { condition: "login_count >= 1", points: 10 },
  "week_warrior": { condition: "tasks_this_week >= 7", points: 50 },
  "book_worm": { condition: "books_completed >= 5", points: 100 },
  "streak_master": { condition: "login_streak >= 30", points: 200 }
};
```

### 2. Système de Récompenses

#### Catégories de Récompenses
- **🎮 Virtuelles**: Avatars spéciaux, thèmes, animations
- **🏆 Privilèges**: Choix de tâches, temps libre, responsabilités
- **🎁 Physiques**: Jouets, livres, sorties (avec validation parent)

#### Interface d'Échange
- **Boutique**: Catalogue des récompenses disponibles
- **Panier**: Système d'achat avec points
- **Historique**: Suivi des achats et statuts

### 3. Dashboard des Récompenses

#### Page Enfant
- **Badges Obtenus**: Galerie avec animations de déblocage
- **Progression**: Barre de progression vers le prochain badge
- **Points**: Affichage du solde et historique des transactions
- **Boutique**: Catalogue des récompenses disponibles

#### Page Parent
- **Validation**: Approuver/refuser les achats de récompenses physiques
- **Configuration**: Créer des récompenses personnalisées
- **Statistiques**: Suivi des badges et récompenses des enfants

## 🛠️ Implémentation Technique

### 1. Backend Services

#### BadgeService
```javascript
class BadgeService {
  async checkAndAwardBadges(userId) {
    // Vérifier les conditions et attribuer les badges
  }
  
  async getUserBadges(userId) {
    // Récupérer les badges de l'utilisateur
  }
  
  async getAvailableBadges(userId) {
    // Badges non encore obtenus
  }
}
```

#### RewardService
```javascript
class RewardService {
  async getAvailableRewards(groupId) {
    // Récompenses disponibles pour le groupe
  }
  
  async purchaseReward(userId, rewardId) {
    // Achat de récompense avec validation des points
  }
  
  async approveRedemption(redemptionId, approved) {
    // Validation parent des achats
  }
}
```

### 2. Frontend Components

#### BadgeGallery
```jsx
const BadgeGallery = ({ userId }) => {
  // Affichage des badges obtenus avec animations
};
```

#### RewardShop
```jsx
const RewardShop = ({ groupId }) => {
  // Boutique avec catalogue et système d'achat
};
```

#### PointBalance
```jsx
const PointBalance = ({ userId }) => {
  // Affichage du solde et historique des points
};
```

### 3. Animations et UX

#### Animations de Déblocage
- **Badge**: Effet de particules + son de réussite
- **Points**: Compteur animé avec effet de gain
- **Récompense**: Confirmation d'achat avec animation

#### Notifications
- **Toast**: Notification de nouveau badge
- **Modal**: Célébration pour badges rares
- **Badge**: Indicateur de nouveaux badges

## 📊 Système de Progression

### 1. Niveaux d'Utilisateur
```javascript
const userLevels = {
  1: { name: "Débutant", pointsRequired: 0, color: "gray" },
  2: { name: "Apprenti", pointsRequired: 100, color: "green" },
  3: { name: "Expert", pointsRequired: 500, color: "blue" },
  4: { name: "Maître", pointsRequired: 1000, color: "purple" },
  5: { name: "Légende", pointsRequired: 2000, color: "gold" }
};
```

### 2. Système de Série
- **Connexions**: Série de jours consécutifs
- **Tâches**: Série de tâches complétées
- **Lecture**: Série de pages lues

### 3. Défis Quotidiens/Hebdomadaires
- **Quotidiens**: Objectifs simples (3 tâches, 10 pages)
- **Hebdomadaires**: Objectifs plus ambitieux (20 tâches, 1 livre)

## 🎨 Interface Utilisateur

### 1. Page Badges Enfant
```
┌─────────────────────────────────────┐
│ 🏆 Mes Badges                       │
├─────────────────────────────────────┤
│ [🔥] [📚] [🎯] [⭐] [🏅] [🎖️]      │
│                                     │
│ Prochain Badge:                     │
│ ████████░░ 80%                      │
│ "Expert Lecteur" - 50 pages restantes│
└─────────────────────────────────────┘
```

### 2. Boutique Récompenses
```
┌─────────────────────────────────────┐
│ 🛒 Boutique                         │
├─────────────────────────────────────┤
│ Solde: 150 🪙                       │
├─────────────────────────────────────┤
│ 🎮 Avatar Spécial    50 🪙 [Acheter]│
│ 🏆 Thème Or         100 🪙 [Acheter]│
│ 🎁 Livre Choix      200 🪙 [Acheter]│
└─────────────────────────────────────┘
```

### 3. Page Parent - Validation
```
┌─────────────────────────────────────┐
│ ✅ Validation Récompenses           │
├─────────────────────────────────────┤
│ Marie veut acheter "Sortie Cinéma"  │
│ Coût: 300 🪙 | Solde: 250 🪙        │
│ [Approuver] [Refuser] [Modifier]    │
└─────────────────────────────────────┘
```

## 🚀 Phases d'Implémentation

### Phase 1: Base de Données
- [ ] Créer les modèles Prisma
- [ ] Migrations de base de données
- [ ] Seed des badges de base

### Phase 2: Backend Core
- [ ] Services Badge et Reward
- [ ] Controllers et routes API
- [ ] Logique de déblocage automatique

### Phase 3: Frontend Base
- [ ] Composants BadgeGallery et RewardShop
- [ ] Page badges enfant
- [ ] Système de points

### Phase 4: Fonctionnalités Avancées
- [ ] Animations et effets
- [ ] Système de validation parent
- [ ] Défis et séries

### Phase 5: Polish
- [ ] Tests et optimisations
- [ ] Traductions complètes
- [ ] Documentation

## 📝 Traductions Nécessaires

### Clés de Traduction
```json
{
  "badges": {
    "title": "Mes Badges",
    "earned": "Obtenu",
    "available": "Disponible",
    "next": "Prochain Badge",
    "progress": "Progression"
  },
  "rewards": {
    "shop": "Boutique",
    "balance": "Solde",
    "purchase": "Acheter",
    "purchased": "Acheté",
    "pending": "En attente"
  },
  "points": {
    "earned": "Points gagnés",
    "spent": "Points dépensés",
    "balance": "Solde",
    "transaction": "Transaction"
  }
}
```

## 🎯 Critères de Succès

- [ ] Système de badges fonctionnel avec déblocage automatique
- [ ] Boutique de récompenses avec système d'achat
- [ ] Validation parent des achats physiques
- [ ] Animations et effets engageants
- [ ] Interface intuitive pour enfants et parents
- [ ] Système de points cohérent et équilibré
- [ ] Traductions complètes en FR/EN/AR

## 📁 Fichiers à Créer/Modifier

### Backend
- `packages/api/prisma/schema.prisma` (modèles)
- `packages/api/src/modules/badges/` (service, controller, routes)
- `packages/api/src/modules/rewards/` (service, controller, routes)
- `packages/api/src/modules/points/` (service, controller, routes)

### Frontend
- `packages/web/src/pages/child/BadgesPage.jsx`
- `packages/web/src/pages/child/RewardsPage.jsx`
- `packages/web/src/pages/parent/RewardsValidationPage.jsx`
- `packages/web/src/components/badges/BadgeGallery.jsx`
- `packages/web/src/components/rewards/RewardShop.jsx`
- `packages/web/src/components/points/PointBalance.jsx`

### Traductions
- `packages/web/src/locales/*.json` (nouvelles clés)

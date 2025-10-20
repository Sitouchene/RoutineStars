# 📚 Documentation API mOOtify (routinestars)

Documentation complète des endpoints de l'API mOOtify.

> *Chaque effort compte* ✨

## 🔗 Base URL

```
http://localhost:3001/api
```

## 🔐 Authentification

### Headers requis

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Types d'utilisateurs

- **Parent/Enseignant** : Accès complet à l'administration
- **Enfant/Élève** : Accès limité à son espace personnel

### Méthodes d'authentification enfant

1. **Code de groupe manuel** : Saisie du code de groupe + PIN
2. **QR Code** : Scan du QR code du groupe + PIN
3. **Groupes récents** : Sélection parmi les groupes précédemment utilisés

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

---

## 🔑 Authentification (`/auth`)

### POST `/auth/register`
Créer un compte parent/enseignant

**Body:**
```json
{
  "email": "parent@exemple.fr",
  "password": "motdepasse123",
  "name": "Jean Dupont",
  "role": "parent"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "Jean Dupont",
    "email": "parent@exemple.fr",
    "role": "parent",
    "groupId": "uuid"
  }
}
```

### POST `/auth/login`
Connexion parent/enseignant

**Body:**
```json
{
  "email": "parent@exemple.fr",
  "password": "motdepasse123"
}
```

### POST `/auth/login-child`
Connexion enfant/élève

**Body:**
```json
{
  "groupId": "ABC123",
  "childId": "uuid",
  "pin": "1234"
}
```

**Ou via QR Code :**
Le QR code contient le code de groupe qui est extrait automatiquement lors du scan. Le processus est :
1. Scan du QR code avec la caméra
2. Extraction du code de groupe
3. Sélection du profil enfant
4. Saisie du code PIN

---

## 👥 Groupes (`/groups`)

### POST `/groups` 🔒
Créer un groupe

**Body:**
```json
{
  "name": "Famille Dupont",
  "type": "family",
  "language": "fr",
  "country": "FR"
}
```

### GET `/groups/:id` 🔒
Récupérer un groupe

### GET `/groups/code/:code`
Récupérer un groupe par code (public)

**Utilisé pour :**
- Validation du code de groupe lors de la connexion enfant
- Extraction du code depuis un QR code scanné

**Réponse:**
```json
{
  "id": "uuid",
  "code": "ABC123",
  "name": "Famille Dupont",
  "type": "family",
  "language": "fr"
}
```

### GET `/groups/:groupId/dashboard-stats` 🔒
Statistiques du dashboard groupe

### GET `/groups/:groupId/notifications` 🔒
Notifications du groupe

---

## 👶 Enfants (`/children`)

### POST `/children` 🔒👨‍👩‍👧‍👦
Créer un enfant

**Body:**
```json
{
  "name": "Samir",
  "age": 7,
  "pin": "1234",
  "avatar": "https://..."
}
```

### GET `/children` 🔒👨‍👩‍👧‍👦
Liste des enfants du groupe

### PUT `/children/:id` 🔒👨‍👩‍👧‍👦
Modifier un enfant

### PUT `/children/:id/avatar` 🔒
Mettre à jour l'avatar (enfant ou parent)

### DELETE `/children/:id` 🔒👨‍👩‍👧‍👦
Supprimer un enfant

### GET `/children/:childId/dashboard-stats` 🔒
Statistiques dashboard enfant

---

## 📋 Catégories (`/categories`)

### GET `/categories` 🔒
Récupérer toutes les catégories (communes + groupe)

### GET `/categories/common` 🔒
Récupérer uniquement les catégories communes

### GET `/categories/group` 🔒
Récupérer uniquement les catégories du groupe

### POST `/categories` 🔒👨‍👩‍👧‍👦
Créer une catégorie

**Body:**
```json
{
  "title": "Routine",
  "display": "Routine quotidienne",
  "description": "Tâches de routine",
  "icon": "clock"
}
```

### PUT `/categories/:id` 🔒👨‍👩‍👧‍👦
Modifier une catégorie

### DELETE `/categories/:id` 🔒👨‍👩‍👧‍👦
Supprimer une catégorie

### PATCH `/categories/:id/toggle` 🔒👨‍👩‍👧‍👦
Activer/Désactiver une catégorie

---

## ✅ Tâches (`/tasks`)

### POST `/tasks/templates` 🔒👨‍👩‍👧‍👦
Créer un template de tâche

**Body:**
```json
{
  "categoryId": "uuid",
  "title": "Ranger ma chambre",
  "icon": "bed",
  "points": 10,
  "recurrence": "daily",
  "description": "Ranger tous les jouets"
}
```

### GET `/tasks/templates` 🔒👨‍👩‍👧‍👦
Liste des templates de tâches

### PUT `/tasks/templates/:id` 🔒👨‍👩‍👧‍👦
Modifier un template

### DELETE `/tasks/templates/:id` 🔒👨‍👩‍👧‍👦
Supprimer un template

### POST `/tasks/generate-daily/:childId` 🔒👨‍👩‍👧‍👦
Générer les tâches quotidiennes

### GET `/tasks/child/:childId` 🔒
Récupérer les tâches d'un enfant

### POST `/tasks/:id/self-evaluate` 🔒👶
Autoévaluation d'une tâche

**Body:**
```json
{
  "score": 8,
  "comment": "J'ai bien rangé"
}
```

### POST `/tasks/:id/validate` 🔒👨‍👩‍👧‍👦
Validation parent d'une tâche

**Body:**
```json
{
  "score": 9,
  "comment": "Très bien fait !"
}
```

---

## 📅 Assignations (`/assignments`)

### POST `/assignments` 🔒👨‍👩‍👧‍👦
Créer une assignation

**Body:**
```json
{
  "taskTemplateId": "uuid",
  "childId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "recurrence": "daily"
}
```

### GET `/assignments` 🔒👨‍👩‍👧‍👦
Liste des assignations du groupe

### GET `/assignments/child/:childId` 🔒👨‍👩‍👧‍👦
Assignations d'un enfant

### PUT `/assignments/:id` 🔒👨‍👩‍👧‍👦
Modifier une assignation

### DELETE `/assignments/:id` 🔒👨‍👩‍👧‍👦
Supprimer une assignation

### POST `/assignments/generate-daily/:childId` 🔒
Générer les tâches quotidiennes

---

## 📝 Soumissions (`/submissions`)

### POST `/submissions/submit` 🔒👶
Soumettre une journée

**Body:**
```json
{
  "date": "2024-01-15",
  "tasks": [
    {
      "taskId": "uuid",
      "selfScore": 8
    }
  ]
}
```

### GET `/submissions/child` 🔒👶
Soumissions de l'enfant connecté

### GET `/submissions/group` 🔒👨‍👩‍👧‍👦
Soumissions du groupe

### POST `/submissions/:id/validate` 🔒👨‍👩‍👧‍👦
Valider une soumission

**Body:**
```json
{
  "parentComment": "Excellent travail !",
  "pointsEarned": 25
}
```

### GET `/submissions/:id/details` 🔒👨‍👩‍👧‍👦
Détails d'une soumission

---

## 📚 Livres (`/books`)

### GET `/books/templates`
Récupérer les templates de livres (public)

### GET `/books/search/google`
Rechercher des livres sur Google Books

**Query:**
```
?q=harry potter&maxResults=10
```

### POST `/books/import/google/:googleBookId` 🔒👨‍👩‍👧‍👦
Importer un livre depuis Google Books

### GET `/books` 🔒👨‍👩‍👧‍👦
Liste des livres du groupe

### POST `/books` 🔒👨‍👩‍👧‍👦
Créer un livre manuellement

**Body:**
```json
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "totalPages": 300,
  "isbn": "978-0-123456-78-9",
  "coverImageUrl": "https://...",
  "language": "fr",
  "genres": ["fantasy", "adventure"]
}
```

### GET `/books/:id` 🔒👨‍👩‍👧‍👦
Détails d'un livre

### PUT `/books/:id` 🔒👨‍👩‍👧‍👦
Modifier un livre

### DELETE `/books/:id` 🔒👨‍👩‍👧‍👦
Supprimer un livre

---

## 📖 Lectures (`/reading`)

### POST `/reading/assign` 🔒👨‍👩‍👧‍👦
Assigner une lecture

**Body:**
```json
{
  "bookId": "uuid",
  "childId": "uuid",
  "assignmentType": "reading",
  "totalPoints": 50,
  "startDate": "2024-01-01",
  "dueDate": "2024-01-31"
}
```

### GET `/reading/child/:childId` 🔒
Lectures assignées à un enfant

### GET `/reading/child/:childId/stats` 🔒
Statistiques de lecture d'un enfant

### GET `/reading/:id` 🔒
Détails d'une assignation de lecture

### PUT `/reading/:id/progress` 🔒👶
Mettre à jour la progression

**Body:**
```json
{
  "currentPage": 25
}
```

### PUT `/reading/:id/finish` 🔒👶
Marquer comme terminé

---

## 🏆 Badges (`/badges`)

### GET `/badges/global`
Liste des badges globaux (public)

### GET `/badges/group/:groupId` 🔒👨‍👩‍👧‍👦
Badges du groupe

### POST `/badges/group/:groupId/import` 🔒👨‍👩‍👧‍👦
Importer un badge global

### POST `/badges/group/:groupId/custom` 🔒👨‍👩‍👧‍👦
Créer un badge personnalisé

**Body:**
```json
{
  "name": "Lecteur assidu",
  "description": "A lu 10 livres",
  "icon": "book",
  "category": "reading",
  "rarity": "common",
  "pointsRequired": 100
}
```

### PUT `/badges/group/:badgeId` 🔒👨‍👩‍👧‍👦
Modifier un badge

### PATCH `/badges/group/:badgeId/toggle` 🔒👨‍👩‍👧‍👦
Activer/Désactiver un badge

### GET `/badges/user/:userId` 🔒
Badges d'un utilisateur

### POST `/badges/user/:userId/unlock/:badgeId` 🔒👨‍👩‍👧‍👦
Débloquer un badge manuellement

### POST `/badges/user/:userId/check-unlock` 🔒👨‍👩‍👧‍👦
Vérifier et débloquer les badges automatiques

### GET `/badges/user/:userId/stats` 🔒
Statistiques des badges

---

## 🎁 Récompenses (`/rewards`)

### GET `/rewards/global`
Liste des récompenses globales (public)

### GET `/rewards/global/category/:category`
Récompenses par catégorie (public)

### GET `/rewards/group/:groupId` 🔒👨‍👩‍👧‍👦
Récompenses du groupe

### POST `/rewards/group/:groupId/import` 🔒👨‍👩‍👧‍👦
Importer une récompense globale

### POST `/rewards/group/:groupId/custom` 🔒👨‍👩‍👧‍👦
Créer une récompense personnalisée

**Body:**
```json
{
  "name": "Sortie au parc",
  "description": "Une sortie au parc de 2h",
  "icon": "park",
  "category": "activity",
  "cost": 50
}
```

### PUT `/rewards/group/:rewardId` 🔒👨‍👩‍👧‍👦
Modifier une récompense

### PATCH `/rewards/group/:rewardId/toggle` 🔒👨‍👩‍👧‍👦
Activer/Désactiver une récompense

### GET `/rewards/user/:userId/redemptions` 🔒
Échanges d'un utilisateur

### POST `/rewards/user/:userId/redeem` 🔒👶
Échanger une récompense

**Body:**
```json
{
  "rewardId": "uuid",
  "childComment": "Je veux aller au parc !"
}
```

### GET `/rewards/user/:userId/stats` 🔒
Statistiques des récompenses

### GET `/rewards/group/:groupId/pending` 🔒👨‍👩‍👧‍👦
Échanges en attente

### PUT `/rewards/redemption/:redemptionId/status` 🔒👨‍👩‍👧‍👦
Modifier le statut d'un échange

**Body:**
```json
{
  "status": "approved",
  "parentComment": "D'accord !"
}
```

---

## 💰 Points (`/points`)

### GET `/points/user/:userId/transactions` 🔒
Historique des transactions

### GET `/points/user/:userId/balance` 🔒
Solde de points

### GET `/points/user/:userId/stats` 🔒
Statistiques des points

### POST `/points/user/:userId/add` 🔒👨‍👩‍👧‍👦
Ajouter des points

**Body:**
```json
{
  "amount": 10,
  "description": "Tâche terminée",
  "source": "task",
  "sourceId": "uuid"
}
```

### POST `/points/user/:userId/spend` 🔒👨‍👩‍👧‍👦
Dépenser des points

### POST `/points/user/:userId/bonus` 🔒👨‍👩‍👧‍👦
Ajouter des points bonus

---

## 🧠 Quiz (`/quiz`)

### GET `/quiz/book/:bookId`
Quiz d'un livre (public)

### GET `/quiz/book/:bookId/trigger/:currentPage`
Quiz déclenché à une page (public)

### POST `/quiz/attempt` 🔒👶
Soumettre un quiz

**Body:**
```json
{
  "quizId": "uuid",
  "answers": [
    {
      "questionId": "uuid",
      "answer": "option1"
    }
  ]
}
```

### GET `/quiz/user/:userId/attempts/:quizId?` 🔒
Tentatives d'un utilisateur

### GET `/quiz/user/:userId/stats` 🔒
Statistiques des quiz

### GET `/quiz/user/:userId/available` 🔒
Quiz disponibles pour un utilisateur

---

## 📊 Statistiques (`/stats`)

### GET `/stats/child/:childId/daily/:date` 🔒👨‍👩‍👧‍👦
Statistiques quotidiennes d'un enfant

### GET `/stats/child/:childId/weekly/:startDate` 🔒👨‍👩‍👧‍👦
Statistiques hebdomadaires

### GET `/stats/child/:childId/monthly/:year/:month` 🔒👨‍👩‍👧‍👦
Statistiques mensuelles

### GET `/stats/group/:startDate/:endDate` 🔒👨‍👩‍👧‍👦
Statistiques du groupe

---

## 💬 Messages (`/messages`)

### GET `/messages` 🔒
Liste des messages

### GET `/messages/by-date` 🔒
Message pour une date

**Query:**
```
?date=2024-01-15
```

### POST `/messages` 🔒👨‍👩‍👧‍👦
Créer un message

**Body:**
```json
{
  "childId": "uuid",
  "date": "2024-01-15",
  "message": "Bravo pour tes efforts !"
}
```

### PUT `/messages/:id` 🔒👨‍👩‍👧‍👦
Modifier un message

### DELETE `/messages/:id` 🔒👨‍👩‍👧‍👦
Supprimer un message

---

## 🕐 Fenêtres d'évaluation (`/eval-window`)

### GET `/eval-window` 🔒
Fenêtres d'évaluation du groupe

### POST `/eval-window` 🔒👨‍👩‍👧‍👦
Créer une fenêtre d'évaluation

**Body:**
```json
{
  "childId": "uuid",
  "startTime": "18:00",
  "endTime": "20:00",
  "daysMask": "1111100",
  "timezone": "Europe/Paris"
}
```

### PUT `/eval-window/:id` 🔒👨‍👩‍👧‍👦
Modifier une fenêtre

### DELETE `/eval-window/:id` 🔒👨‍👩‍👧‍👦
Supprimer une fenêtre

---

## 🔍 Codes de statut HTTP

- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `500` : Erreur serveur

## 📝 Légende des permissions

- 🔒 : Authentification requise
- 👨‍👩‍👧‍👦 : Parent/Enseignant uniquement
- 👶 : Enfant/Élève uniquement
- 🌐 : Public (pas d'authentification)

## 🔧 Variables d'environnement

```bash
# Base de données
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Google Books API
GOOGLE_BOOKS_API_KEY="your-api-key"

# Supabase (optionnel)
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests d'intégration
pnpm test:integration

# Tests E2E
pnpm test:e2e
```

---

**Développé avec ❤️ par l'équipe mOOtify pour aider les familles et enseignants à mieux s'organiser**

*Chaque effort compte* ✨

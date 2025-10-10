# 🗺️ Roadmap RoutineStars

## ✅ Fonctionnalités terminées

### 🔐 Authentification
- [x] Inscription parent (register)
- [x] Connexion parent (login)
- [x] Connexion enfant (PIN) - structure prête
- [x] Gestion des tokens JWT
- [x] Protection des routes
- [x] Interface de login/register

### 🏗️ Architecture
- [x] Monorepo avec pnpm workspaces
- [x] Backend Express + Prisma
- [x] Frontend React + Vite + PWA
- [x] Base de données PostgreSQL (Supabase)
- [x] Code partagé (shared package)

---

## 🚧 En cours de développement

### 👨‍👩‍👧 Gestion des enfants
- [ ] CRUD enfants (create, read, update, delete)
- [ ] Interface de gestion des profils enfants
- [ ] Upload d'avatars
- [ ] Validation des données enfant

---

## 📋 Backlog (à développer)

### 🔐 Authentification (manquantes)
- [ ] **Forget Password** - Demande de réinitialisation
- [ ] **Reset Password** - Nouveau mot de passe via email
- [ ] **Email verification** - Vérification email à l'inscription
- [ ] **Session management** - Refresh tokens, logout global

### 📋 Gestion des tâches
- [x] **CRUD TaskTemplates** - Créer, modifier, supprimer des modèles de tâches
- [x] **Système d'assignation** - Assigner des tâches à des enfants avec dates
- [x] **Génération automatique** - Créer les tâches quotidiennes depuis les assignations
- [x] **Catégorisation** - Routine, Maison, Études
- [x] **Récurrence** - Quotidien, semaine, weekend, jours spécifiques
- [x] **Points et récompenses** - Système de scoring
- [ ] **Interface d'assignation avancée** - Tableau de sélection multi-tâches/enfants
- [ ] **Assignation rapide** - Clic sur tâche → choisir enfants
- [ ] **Assignation par enfant** - Clic sur enfant → choisir tâches avec paramètres distincts

### 👶 Interface enfant
- [x] **Connexion PIN** - Interface de sélection + clavier PIN
- [x] **Dashboard enfant** - Vue des tâches du jour
- [x] **Autoévaluation** - Interface 0-50-100% avec animations
- [ ] **Historique** - Voir les tâches passées
- [ ] **Récompenses** - Affichage des badges et points
 - [ ] **Indicateur fenêtre horaire** - Afficher la plage d’autoévaluation autorisée et l’état (ouvert/fermé)

### ✅ Validation parent
- [ ] **Interface de validation** - Voir les autoévaluations enfants
- [ ] **Ajustement des scores** - Modifier les notes des enfants
- [ ] **Commentaires** - Ajouter des encouragements
- [ ] **Verrouillage** - Finaliser les tâches validées
 - [ ] **Règles d’autoévaluation** - Faire respecter la fenêtre horaire côté API et UI

### 📊 Statistiques et suivi
- [ ] **Dashboard parent** - Vue d'ensemble des progrès
- [ ] **Graphiques** - Évolution des scores par enfant
- [ ] **Rapports** - Statistiques par catégorie, période
- [ ] **Export** - Données en PDF/Excel
 - [ ] **Alignement des dates** - Normaliser Jour/Semaine/Mois (UTC vs local, TZ Ottawa)

### 🎨 UX/UI
- [ ] **Design system** - Composants shadcn/ui
- [ ] **Animations** - Framer Motion pour les interactions
- [ ] **Mode sombre** - Thème dark/light
- [ ] **Responsive** - Mobile, tablette, desktop
- [ ] **PWA** - Installation, offline, notifications

### 🔔 Notifications
- [ ] **Web Push** - Rappels de tâches
- [ ] **Email** - Résumés quotidiens/hebdomadaires
- [ ] **In-app** - Notifications de validation

### 📱 Mobile (Phase 2)
- [ ] **React Native** - App mobile native
- [ ] **Push notifications** - Notifications natives
- [ ] **Biométrie** - Connexion par empreinte/face
- [ ] **Offline sync** - Synchronisation hors ligne

### 🔧 Technique
- [ ] **Tests** - Unit tests, E2E tests
- [ ] **CI/CD** - Déploiement automatique
- [ ] **Monitoring** - Logs, erreurs, performance
- [ ] **Sécurité** - Rate limiting, audit
- [ ] **Documentation** - API docs, guides utilisateur
 - [ ] **Tests fenêtre horaire** - Couvrir `isWithinWindow` (fuseau, jours, bords)
 - [ ] **Tests LAN** - Accès mobile/tablette sur Wi‑Fi local: exposition Vite (`host: true`), CORS multi-origines, règles pare‑feu (ports 5173/3001), validation accès `http://<IP>:5173` et `/api/health`

---

## 🎯 Priorités actuelles

### Phase 1 (En cours) - MVP
1. **Gestion des enfants** ← **MAINTENANT**
2. **Création de tâches** 
3. **Interface enfant basique**
4. **Autoévaluation enfant**

### Phase 2 - Fonctionnalités avancées
1. Validation parent
2. Statistiques
3. Notifications
4. PWA complète

### Phase 3 - Mobile et évolutions
1. App React Native
2. Fonctionnalités avancées
3. Intégrations externes

---

## 📅 Timeline estimée

- **Phase 1** : 2-3 semaines
- **Phase 2** : 3-4 semaines  
- **Phase 3** : 4-6 semaines

---

*Dernière mise à jour : [Date actuelle]*

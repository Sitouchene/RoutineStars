# 🚀 RoutineStars - Nouvelle Logique de Navigation

## 📱 Écrans de Navigation

### **Écran 1 : Bienvenue + Langue + Mode**
**Route :** `/`

**Fonctionnalités :**
- ✅ Sélection de langue (🇫🇷 Français, 🇬🇧 English, 🇩🇿 العربية)
- ✅ Sélection de mode d'utilisation (🏠 Maison, 🎓 École)
- ✅ Interface attractive avec animations
- ✅ Persistance des préférences

**Composant :** `WelcomeScreen.jsx`

### **Écran 2 : Rôle + Authentification Intégrée**
**Route :** `/role-selection`

**Fonctionnalités :**
- ✅ Affichage dynamique des rôles selon le mode
- ✅ Authentification complète (Parent/Enseignant)
- ✅ Authentification simplifiée (Enfant/Élève)
- ✅ Gestion des erreurs et états de chargement

**Composant :** `RoleSelectionScreen.jsx`

## 🔧 Architecture Technique

### **Stores Zustand**

#### **NavigationStore** (`navigationStore.js`)
```javascript
{
  selectedLanguage: 'fr',
  selectedMode: { type: 'family', name: 'Maison' },
  selectedRole: { type: 'parent', name: 'Parent' },
  preferences: { language: 'fr', theme: 'default' }
}
```

#### **AuthStore** (`authStore.js`)
```javascript
{
  user: { id, name, role, email },
  token: 'jwt-token',
  group: { id, type, name, code },
  isAuthenticated: true
}
```

### **Services API**

#### **AuthService** (`authService.js`)
- `loginWithCredentials(email, password)` - Auth complète
- `loginWithPin(pin, groupCode)` - Auth simplifiée
- `checkGroupCode(code)` - Vérification code groupe
- `getGroupByCode(code)` - Récupération groupe
- `createGroup(type, name, language)` - Création groupe

## 🎯 Flow de Navigation

### **1. Écran d'Accueil**
```
Utilisateur → Sélection Langue → Sélection Mode → Navigation vers Rôle
```

### **2. Sélection de Rôle**
```
Mode Family → Parent/Child
Mode Classroom → Teacher/Student
```

### **3. Authentification**
```
Parent/Teacher → Email + Mot de passe
Child/Student → PIN + Code groupe
```

### **4. Dashboard**
```
Family → /family/dashboard
Classroom → /classroom/dashboard
```

## 🧪 Tests

### **Route de Test**
**URL :** `/test`

**Fonctionnalités :**
- ✅ Affichage état des stores
- ✅ Tests automatisés
- ✅ Boutons de reset
- ✅ Instructions détaillées

## 📋 Données de Test

### **Groupes Disponibles**
- **Famille :** `Famille Test` - Code: `RENARD_CYAN_765`
- **Classe :** `Classe CM2A` - Code: `SINGE_GRIS_217`

### **Utilisateurs de Test**
- **Parent :** `Marie Dupont` - `marie.dupont@test.com`
- **Enfant :** `Lucas Dupont` - PIN: `1234`
- **Enseignant :** `Mme Martin` - `martin@ecole.fr`
- **Élève :** `Emma Leroy` - PIN: `5678`

## 🔄 États de Navigation

### **Étapes de Validation**
1. **Langue sélectionnée** → Peut continuer vers Mode
2. **Mode sélectionné** → Peut continuer vers Rôle
3. **Rôle sélectionné** → Peut procéder à l'authentification
4. **Authentification réussie** → Navigation vers Dashboard

### **Gestion des Erreurs**
- ✅ Redirection automatique si données manquantes
- ✅ Messages d'erreur contextuels
- ✅ Reset des états en cas d'erreur
- ✅ Persistance des préférences utilisateur

## 🎨 Interface Utilisateur

### **Design System**
- **Couleurs :** Gradient bleu-indigo-violet
- **Animations :** Hover effects, scale transforms
- **Responsive :** Mobile-first design
- **Accessibilité :** Contrastes élevés, navigation clavier

### **Composants**
- **Boutons :** Styles cohérents avec états hover/disabled
- **Formulaires :** Validation en temps réel
- **Feedback :** Messages d'erreur et de succès
- **Loading :** États de chargement avec spinners

## 🚀 Prochaines Étapes

1. **Intégration API** - Connecter les services d'authentification
2. **Tests E2E** - Automatiser les tests de navigation
3. **Internationalisation** - Support complet des langues
4. **Thèmes** - Implémentation des thèmes utilisateur
5. **QR Codes** - Génération de codes QR pour les groupes

---

**Status :** ✅ **Navigation UI complète et fonctionnelle**
**Test :** Visitez `/test` pour vérifier le fonctionnement

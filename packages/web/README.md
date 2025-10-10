# 🎨 Web Frontend - RoutineStars

Application web PWA construite avec React + Vite.

## 🏗️ Architecture

### Structure

```
src/
├── components/         # Composants UI
│   ├── ui/            # Composants de base (shadcn/ui)
│   ├── parent/        # Composants interface parent
│   └── child/         # Composants interface enfant
├── lib/               # Utilitaires
│   ├── api-client.js  # Client API
│   └── utils.js       # Fonctions utils
├── pages/             # Pages/Routes
│   ├── LoginPage.jsx
│   ├── parent/
│   │   └── Dashboard.jsx
│   └── child/
│       └── Dashboard.jsx
├── stores/            # State management (Zustand)
│   └── authStore.js
├── App.jsx            # Point d'entrée app
├── main.jsx          # Point d'entrée React
└── index.css         # Styles globaux Tailwind
```

## 🎨 Interface

### Double mode : Parent & Enfant

**Mode Parent**
- 🎛️ Dashboard administratif
- 👨‍👩‍👧 Gestion des enfants
- 📋 Création de tâches
- 📊 Statistiques et suivi
- ✅ Validation des autoévaluations

**Mode Enfant**
- 🌈 Interface colorée et ludique
- 🎯 Tâches du jour
- 🎨 Autoévaluation visuelle (0-50-100%)
- 🏆 Récompenses et badges
- 📈 Mon historique

## 🚀 Fonctionnalités PWA

### Service Worker
- 📦 Cache des assets statiques
- 🔄 Stratégie NetworkFirst pour l'API
- 📴 Fonctionnement hors ligne (historique)

### Manifest
- 📱 Installation sur écran d'accueil
- 🎨 Icônes adaptatives
- 🌐 Mode standalone

### Optimisations
- ⚡ Vite pour build ultra-rapide
- 🎨 Tailwind CSS (JIT)
- 📦 Code splitting automatique
- 🖼️ Lazy loading des images

## 📦 State Management

### Zustand Stores

**authStore.js**
```javascript
const { user, token, login, logout } = useAuthStore();

// Login
login(userData, token);

// Logout
logout();

// Get auth header
const headers = useAuthStore(state => state.getAuthHeader());
```

### React Query

Cache et synchronisation des données serveur :
```javascript
const { data, isLoading } = useQuery({
  queryKey: ['children'],
  queryFn: () => childrenApi.getAll(headers),
});
```

## 🎨 Styling

### Tailwind CSS

Configuration personnalisée :
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {...}, // Indigo
    }
  }
}
```

Utilisation :
```jsx
<div className="bg-primary-600 text-white p-4 rounded-lg">
  Bouton
</div>
```

### Classes utilitaires custom

```css
.btn { /* ... */ }
.btn-primary { /* ... */ }
.card { /* ... */ }
```

## 🔌 API Client

### Utilisation

```javascript
import { authApi, childrenApi } from '@/lib/api-client';

// Login parent
const { user, token } = await authApi.loginParent({
  email: 'test@test.com',
  password: 'password123'
});

// Get children (avec auth)
const headers = useAuthStore(state => state.getAuthHeader());
const children = await childrenApi.getAll(headers);
```

### Configuration

```javascript
// .env
VITE_API_URL=http://localhost:3001/api
```

## 🎯 Routing

### Routes principales

```
/login              → Page de connexion
/parent/*           → Dashboard parent (protégé)
/child/*            → Dashboard enfant (protégé)
```

### Protection des routes

```jsx
// Automatique dans App.jsx
<Route
  path="/parent/*"
  element={
    isAuthenticated && user?.role === 'parent' ? (
      <ParentDashboard />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
```

## 🧩 Composants partagés

### Code partagé avec l'API

```javascript
// Import depuis le package shared
import { TASK_CATEGORIES, TASK_ICONS } from 'shared/constants';
import { taskTemplateSchema } from 'shared/validators';
```

### Futurs composants (à créer)

- `TaskCard` : Carte de tâche
- `ProgressCircle` : Cercle de progression
- `PinInput` : Clavier PIN enfant
- `BadgeDisplay` : Affichage badges
- `StatsChart` : Graphiques stats

## 📱 Responsive Design

### Breakpoints Tailwind

```
sm: 640px   → Mobile large
md: 768px   → Tablette
lg: 1024px  → Desktop
xl: 1280px  → Large desktop
```

### Utilisation

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🔧 Scripts

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Preview du build
pnpm preview
```

## 📦 Dépendances principales

- `react` : UI library
- `react-router-dom` : Routing
- `zustand` : State management
- `@tanstack/react-query` : Server state
- `tailwindcss` : Styling
- `vite` : Build tool
- `vite-plugin-pwa` : PWA support
- `lucide-react` : Icons

## 🎨 Design System (à venir)

- [ ] Palette de couleurs étendue
- [ ] shadcn/ui components
- [ ] Animations Framer Motion
- [ ] Design tokens
- [ ] Mode sombre



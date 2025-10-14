# Guide d'Internationalisation (i18n)

## 📚 Structure

### Fichiers de traduction
Les traductions sont organisées dans `/src/locales/` avec une **structure aplatie** :

```
src/locales/
├── fr.json  (Français - Québec 🇨🇦)
├── en.json  (English - UK 🇬🇧)
└── ar.json  (العربية - Algérie 🇩🇿)
```

### Format des clés
**Structure aplatie** avec des points pour la hiérarchie :

```json
{
  "common.welcome": "Bienvenue",
  "dashboard.home": "Accueil",
  "auth.login": "Se connecter"
}
```

❌ **PAS de structure imbriquée** :
```json
{
  "common": {
    "welcome": "Bienvenue"  // À éviter
  }
}
```

## 🛠️ Utilisation

### Dans un composant React

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('dashboard.welcome', { name: 'Salim' })}</p>
    </div>
  );
}
```

### Avec interpolation

```json
{
  "dashboard.welcome": "Bienvenue, {{name}} 👋"
}
```

```jsx
{t('dashboard.welcome', { name: user?.name })}
```

### Pluralisation

```json
{
  "categories.count": "{{count}} catégorie",
  "categories.count_plural": "{{count}} catégories"
}
```

```jsx
{t('categories.count', { count: 5 })}  // "5 catégories"
```

## 🌐 Sélecteur de langue

### Composant `LanguageSelector`

**Deux variantes** :

1. **Boutons** (pour WelcomeScreen) :
```jsx
<LanguageSelector variant="buttons" />
```

2. **Dropdown avec drapeau** (pour Dashboard) :
```jsx
<LanguageSelector variant="dropdown" />
```

### Drapeaux utilisés
- 🇨🇦 Français (Québec/Canada)
- 🇬🇧 English (UK)
- 🇩🇿 العربية (Algérie)

## 🔄 RTL (Right-to-Left) pour l'arabe

Le composant `LanguageSelector` gère automatiquement :
- `document.documentElement.dir = 'rtl'` pour l'arabe
- `document.documentElement.dir = 'ltr'` pour français/anglais
- `document.documentElement.lang` pour l'attribut lang HTML

## 📝 Catégories de traductions

### Communes
```
common.* - Éléments réutilisables (boutons, messages)
```

### Authentification
```
auth.* - Connexion, inscription, logout
welcome.* - Écran d'accueil
```

### Dashboard
```
dashboard.* - Navigation, accueil, codes de groupe
```

### Pages principales
```
children.* - Gestion des enfants/élèves
categories.* - Gestion des catégories
tasks.* - Gestion des tâches
assignments.* - Gestion des assignations
submissions.* - Validations
stats.* - Statistiques
messages.* - Messages et règles
```

## ✅ Pages traduites

- ✅ `WelcomeScreen` - Écran d'accueil avec sélection de langue
- ✅ `Dashboard (Parent)` - Navigation, accueil, codes, stats
- 🔄 `LoginScreen` - À traduire
- 🔄 `RegisterScreen` - À traduire
- 🔄 `ChildLoginScreen` - À traduire
- 🔄 Pages enfants (Children, Tasks, Categories, etc.) - À traduire

## 🎯 Distinction importante

### Langue de l'application vs Langue du groupe

1. **Langue de l'application** (UI) :
   - Contrôlée par `i18next` et `LanguageSelector`
   - Stockée dans `localStorage`
   - Change l'interface utilisateur

2. **Langue/Pays du groupe** :
   - Stockée dans le modèle `Group` (champs `language` et `country`)
   - Utilisée pour :
     - Bibliothèques de contenu (tâches, récompenses)
     - Ressources localisées
     - Calendriers, jours fériés
     - Suggestions adaptées au contexte culturel

## 📦 Packages utilisés

```json
{
  "i18next": "^25.6.0",
  "react-i18next": "^16.0.1",
  "i18next-browser-languagedetector": "^8.2.0"
}
```

## 🔧 Configuration

Voir `/src/i18n.js` pour la configuration initiale :

```javascript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr, en, ar },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'ar'],
    ...
  });
```

## 🚀 Prochaines étapes

1. Traduire les pages d'authentification
2. Traduire les modales et formulaires
3. Traduire les messages d'erreur
4. Ajouter des traductions pour les notifications
5. Créer des bibliothèques de contenu par langue/pays


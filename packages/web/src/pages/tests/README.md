# 🧪 Pages de Test mOOtify

## 📝 Description

Ce dossier contient toutes les pages de test et de développement pour mOOtify. Ces pages permettent de tester les nouveaux composants et fonctionnalités avant leur intégration dans l'application principale.

## 🚀 Accès

### URL de Base
- **Index des tests** : `http://localhost:3000/tests`
- **Carousel d'onboarding** : `http://localhost:3000/tests/onboarding`

### Navigation
1. Accédez à `/tests` pour voir la liste de tous les tests disponibles
2. Cliquez sur la page de test souhaitée
3. Utilisez le bouton "Retour à l'accueil" pour revenir à l'application principale

## 📁 Structure

```
pages/tests/
├── index.js                    # Exports des pages de test
├── TestsIndexPage.jsx          # Page d'index des tests
├── OnboardingTestPage.jsx      # Test du carousel d'onboarding
└── README.md                   # Cette documentation
```

## 🎯 Pages Disponibles

### 1. TestsIndexPage
- **Route** : `/tests`
- **Description** : Page d'accueil des tests avec navigation
- **Fonctionnalités** :
  - Liste de tous les tests disponibles
  - Navigation vers chaque test
  - Informations sur le statut de chaque test
  - Retour à l'accueil

### 2. OnboardingTestPage
- **Route** : `/tests/onboarding`
- **Description** : Test du carousel d'onboarding
- **Fonctionnalités** :
  - Affichage du composant OnboardingDemo
  - Test complet du carousel en 6 slides
  - Navigation et animations
  - Placeholders pour screenshots

## 🔧 Ajout de Nouvelles Pages de Test

### 1. Créer la Page
```jsx
// pages/tests/MonTestPage.jsx
export default function MonTestPage() {
  return (
    <div className="min-h-screen">
      {/* Votre composant de test */}
    </div>
  );
}
```

### 2. Ajouter l'Export
```js
// pages/tests/index.js
export { default as MonTestPage } from './MonTestPage';
```

### 3. Ajouter la Route
```jsx
// App.jsx
import { MonTestPage } from './pages/tests';

// Dans les Routes
<Route path="/tests/mon-test" element={<MonTestPage />} />
```

### 4. Mettre à Jour l'Index
```jsx
// TestsIndexPage.jsx
const testPages = [
  // ... autres tests
  {
    path: '/tests/mon-test',
    title: 'Mon Test',
    description: 'Description de mon test',
    icon: '🧪',
    status: '✅ Prêt'
  }
];
```

## 🎨 Style et Design

### Thème
- Utilise les couleurs mOOtify (mint-purple)
- Design cohérent avec l'application principale
- Responsive design

### Navigation
- Boutons avec effets hover
- Transitions fluides
- Icônes expressives

## 📋 Bonnes Pratiques

### Nommage
- Utilisez des noms descriptifs : `OnboardingTestPage`
- Ajoutez le suffixe `TestPage` pour les pages de test
- Utilisez des routes claires : `/tests/onboarding`

### Documentation
- Documentez chaque page de test
- Ajoutez des commentaires explicatifs
- Mettez à jour ce README lors de l'ajout de nouvelles pages

### Organisation
- Gardez les pages de test simples et focalisées
- Un test par composant/fonctionnalité
- Utilisez des placeholders pour les données

## 🚨 Important

- **Développement uniquement** : Ces pages ne doivent pas être accessibles en production
- **Tests isolés** : Chaque page teste un composant spécifique
- **Données factices** : Utilisez des données de test, pas de vraies données
- **Performance** : Les pages de test peuvent être plus lourdes que l'application normale

## 🔮 Roadmap

- [ ] Ajouter des tests pour d'autres composants
- [ ] Créer un système de tests automatisés
- [ ] Ajouter des métriques de performance
- [ ] Intégrer des tests d'accessibilité
- [ ] Créer des tests de responsive design

---

*Développé avec ❤️ par l'équipe mOOtify*  
*Chaque effort compte* ✨

# 🦉 Carousel d'Onboarding mOOtify

## 📝 Description

Le carousel d'onboarding mOOtify est un composant interactif qui guide les nouveaux utilisateurs (parents/enseignants) à travers les fonctionnalités principales de l'application en 6 étapes.

## 🎯 Structure des 6 Slides

### 1. **Rejoindre intuitivement** 🦉
- Vue d'ensemble de mOOtify
- Présentation des fonctionnalités clés
- Introduction à mOtivO

### 2. **Intégrer automatiquement** 👨‍👩‍👧‍👦
- Création du compte parent/enseignant
- Ajout des enfants/élèves
- Génération et partage des codes d'accès

### 3. **Assigner efficacement** 📅
- Bibliothèque de tâches prêtes à l'emploi
- Création de tâches personnalisées
- Système d'assignation flexible

### 4. **Responsabiliser positivement** 🤝
- Processus d'auto-évaluation des enfants
- Validation et encouragement des parents
- Développement de l'autonomie

### 5. **Lire intelligemment** 📖
- Bibliothèque de livres adaptés
- Suivi de progression
- Quiz de compréhension automatiques

### 6. **Récompenser généreusement** 🏆
- Système de badges et points
- Récompenses personnalisables
- Célébrations des réussites

## 🎨 Design et Navigation

### Style de Navigation
- **Mini rectangles** : `▭▭▬▭▭▭` disposés horizontalement en bas
- **Flèches** : Superposées sur le slide, à gauche et droite, centrées verticalement
- **Animation** : Rectangle actif avec dégradé mint-purple

### Animations
- **Transitions** : Framer Motion pour les changements de slides
- **Entrées** : Animations d'apparition pour les éléments
- **Screenshots** : Placeholders avec effets de chargement

## 🚀 Utilisation

### Composant Principal
```jsx
import { OnboardingCarousel } from '@/components/onboarding';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <OnboardingCarousel 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
    />
  );
}
```

### Composant de Démonstration
```jsx
import { OnboardingDemo } from '@/components/onboarding';

function DemoPage() {
  return <OnboardingDemo />;
}
```

## 📱 Responsive Design

- **Mobile** : Une slide à la fois, navigation tactile, flèches adaptées
- **Tablette** : Adaptation optimale des screenshots et indicateurs
- **Desktop** : Vue complète avec navigation horizontale en bas

## 🎯 Fonctionnalités

### Navigation
- ✅ Flèches précédent/suivant
- ✅ Mini rectangles cliquables
- ✅ Navigation clavier (optionnel)
- ✅ Indicateur de progression

### Animations
- ✅ Transitions fluides entre slides
- ✅ Animations d'entrée pour les éléments
- ✅ Effets de hover sur les boutons
- ✅ Animations mOtivO (clignement des yeux)

### Contenu
- ✅ Placeholders pour screenshots
- ✅ Icônes et emojis expressifs
- ✅ Textes multilingues (i18n ready)
- ✅ Liens vers guides détaillés

## 🔧 Personnalisation

### Couleurs
- Utilise les variables CSS de mOOtify
- Dégradé mint-purple pour les éléments actifs
- Couleurs de thème adaptatives

### Contenu
- Structure modulaire pour faciliter les modifications
- Support i18n intégré
- Placeholders facilement remplaçables

## 📋 TODO - Améliorations Futures

- [ ] Intégration des vrais screenshots
- [ ] Animations mOtivO plus avancées
- [ ] Support clavier complet
- [ ] Mode plein écran
- [ ] Sauvegarde de la progression
- [ ] Analytics de completion

## 🎨 Style Guide

### Typographie
- **Titres** : Poppins (gras, impact visuel)
- **Texte courant** : Rubik (lisible, moderne)
- **Éléments ludiques** : Baloo 2 (arrondi, amical)

### Couleurs
- **Principal** : Vert menthe (#58D6A8) et violet (#B69CF4)
- **Aventurier** : Bleu ciel (#38bdf8) et turquoise (#14b8a6)
- **Créatif** : Rose (#fb7185) et rose clair (#f9a8d4)

---

*Développé avec ❤️ par l'équipe mOOtify*  
*Chaque effort compte* ✨

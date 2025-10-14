# 🚀 Guide Rapide de Traduction

## Comment traduire une page

### Étape 1 : Import de useTranslation

```jsx
import { useTranslation } from 'react-i18next';

export default function MyPage() {
  const { t } = useTranslation();
  // ...
}
```

### Étape 2 : Ajouter les clés de traduction

Dans `/src/locales/fr.json`, `/src/locales/en.json`, `/src/locales/ar.json` :

```json
{
  "myPage.title": "Mon Titre",
  "myPage.description": "Ma description",
  "myPage.button": "Bouton"
}
```

### Étape 3 : Remplacer les textes statiques

**Avant** :
```jsx
<h1>Mon Titre</h1>
<p>Ma description</p>
<button>Bouton</button>
```

**Après** :
```jsx
<h1>{t('myPage.title')}</h1>
<p>{t('myPage.description')}</p>
<button>{t('myPage.button')}</button>
```

## Cas spéciaux

### Interpolation (variables)

**Traduction** :
```json
{
  "welcome.message": "Bonjour, {{name}} !"
}
```

**Utilisation** :
```jsx
{t('welcome.message', { name: user.name })}
```

### Conditionnel (type de groupe)

**Traduction** :
```json
{
  "dashboard.children": "Enfants",
  "dashboard.students": "Élèves"
}
```

**Utilisation** :
```jsx
{t(`dashboard.${group?.type === 'family' ? 'children' : 'students'}`)}
```

### Pluralisation

**Traduction** :
```json
{
  "items.count": "{{count}} élément",
  "items.count_plural": "{{count}} éléments"
}
```

**Utilisation** :
```jsx
{t('items.count', { count: items.length })}
```

## Exemples complets

### Exemple 1 : Page simple

```jsx
import { useTranslation } from 'react-i18next';

export default function CategoriesPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('categories.title')}</h1>
      <p>{t('categories.description')}</p>
      <button onClick={onCreate}>
        {t('categories.add')}
      </button>
    </div>
  );
}
```

**Traductions** :
```json
{
  "categories.title": "Catégories",
  "categories.description": "Gérez vos catégories",
  "categories.add": "Nouvelle catégorie"
}
```

### Exemple 2 : Formulaire

```jsx
import { useTranslation } from 'react-i18next';

export default function TaskForm() {
  const { t } = useTranslation();
  
  return (
    <form>
      <label>{t('tasks.title')}</label>
      <input placeholder={t('tasks.titlePlaceholder')} />
      
      <label>{t('tasks.points')}</label>
      <input type="number" placeholder={t('tasks.pointsPlaceholder')} />
      
      <button type="submit">
        {loading ? t('common.saving') : t('common.save')}
      </button>
    </form>
  );
}
```

**Traductions** :
```json
{
  "tasks.title": "Titre",
  "tasks.titlePlaceholder": "Nom de la tâche",
  "tasks.points": "Points",
  "tasks.pointsPlaceholder": "10",
  "common.saving": "Enregistrement...",
  "common.save": "Enregistrer"
}
```

### Exemple 3 : Messages de confirmation

```jsx
import { useTranslation } from 'react-i18next';

export default function DeleteButton({ item }) {
  const { t } = useTranslation();
  
  const handleDelete = () => {
    if (confirm(t('items.deleteConfirm', { name: item.name }))) {
      deleteItem(item.id);
    }
  };
  
  return (
    <button onClick={handleDelete}>
      {t('common.delete')}
    </button>
  );
}
```

**Traductions** :
```json
{
  "items.deleteConfirm": "Voulez-vous vraiment supprimer {{name}} ?",
  "common.delete": "Supprimer"
}
```

## Pages à traduire (ordre recommandé)

### 1. RegisterScreen ⏳
**Fichier** : `/src/pages/RegisterScreen.jsx`  
**Clés nécessaires** : Déjà préparées dans les fichiers de traduction

**À faire** :
- Ajouter `const { t } = useTranslation();`
- Remplacer tous les textes statiques
- Mettre à jour les messages d'erreur
- Traduire les labels de formulaire
- Traduire les placeholders

### 2. ChildLoginScreen ⏳
**Fichier** : `/src/pages/ChildLoginScreen.jsx`  
**Clés nécessaires** : Déjà préparées dans les fichiers de traduction

**À faire** :
- Ajouter `useTranslation`
- Traduire les instructions
- Traduire les labels et placeholders
- Traduire les messages d'erreur

### 3. ChildrenPage ⏳
**Fichier** : `/src/pages/parent/ChildrenPage.jsx`  
**Clés nécessaires** : Déjà dans les fichiers de traduction

**À faire** :
- Traduire le titre et la description
- Adapter les termes selon le type de groupe (enfants vs élèves)
- Traduire les cartes d'enfants
- Traduire les messages vides

### 4. CategoriesPage ⏳
**Fichier** : `/src/pages/parent/CategoriesPage.jsx`  
**Clés nécessaires** : Déjà dans les fichiers de traduction

**À faire** :
- Traduire les sections (système, actives, inactives)
- Traduire les actions (activer, désactiver)
- Traduire les modales

## Checklist par page

- [ ] Import de `useTranslation`
- [ ] Déclaration de `const { t } = useTranslation();`
- [ ] Tous les titres traduits
- [ ] Tous les boutons traduits
- [ ] Tous les labels de formulaire traduits
- [ ] Tous les placeholders traduits
- [ ] Tous les messages d'erreur traduits
- [ ] Messages de confirmation traduits
- [ ] Messages de succès traduits
- [ ] Textes conditionnels gérés
- [ ] Pluriels gérés
- [ ] Test en français ✓
- [ ] Test en anglais ✓
- [ ] Test en arabe ✓

## Commandes utiles

```bash
# Lancer le serveur de développement
pnpm run dev

# Vérifier les lints
npm run lint

# Rechercher un texte non traduit
grep -r "Mon texte" src/pages/
```

## Bonnes pratiques

1. **Cohérence** : Utiliser les clés `common.*` pour les textes réutilisables
2. **Organisation** : Regrouper les clés par page/composant
3. **Nommage** : `page.section.element` (ex: `children.add.button`)
4. **Variables** : Toujours entre doubles accolades `{{variable}}`
5. **Tests** : Tester les 3 langues après chaque traduction
6. **RTL** : Vérifier la mise en page en arabe

## Aide rapide

| Besoin | Clé suggérée |
|--------|--------------|
| Titre de page | `pageName.title` |
| Description | `pageName.description` |
| Bouton ajouter | `pageName.add` |
| Bouton modifier | `common.edit` |
| Bouton supprimer | `common.delete` |
| Confirmer suppression | `pageName.deleteConfirm` |
| Aucun élément | `pageName.none` |
| Chargement | `common.loading` |
| Erreur | `common.error` |
| Succès | `common.success` |

---

**Astuce** : Utilisez la recherche `Ctrl+F` dans les fichiers JSON pour réutiliser les clés existantes !


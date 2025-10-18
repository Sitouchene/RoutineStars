# 🎨 Identité visuelle — mOOtify

## 🦉 Nom & concept

**Nom :** mOOtify

**Signification :** Contraction entre *motiver* et *modify* — incarne l'idée d'évolution positive, de motivation et de progression personnelle.

**Mascotte :** Une chouette stylisée, symbole de sagesse et d'apprentissage. Ses yeux remplacent les deux "O" du mot mOOtify, renforçant l'aspect bienveillant et ludique.

## 💬 Slogan

**Chaque effort compte.**

Version facultative, utilisée seulement lorsque l'espace visuel le permet (pages d'accueil, splash screen, écrans marketing).

## 🌈 Couleurs principales

| Usage | Couleur | Code HEX | Notes |
|-------|---------|----------|-------|
| Couleur primaire | Vert menthe | `#58D6A8` | Couleur d'énergie et de motivation |
| Couleur secondaire | Violet clair | `#B69CF4` | Accent doux et équilibrant |
| Couleur neutre | Blanc cassé | `#FAF9F6` | Fond par défaut (mode clair) |
| Couleur fond sombre | Gris-noir profond | `#121212` | Pour mode dark |
| Texte principal (clair) | Gris anthracite | `#2E2E2E` | Lisibilité optimale |
| Texte principal (sombre) | Blanc cassé | `#FAF9F6` | Contraste en mode dark |

## 🧩 Typographie

**Police principale (logo et titres) :** Poppins ou Nunito (selon rendu final) — ronde, moderne et bien lisible pour enfants et adultes.

**Police secondaire (texte courant) :** Inter ou Rubik — simple, claire, adaptée aux interfaces responsives.

**Alternative fun (mascotte / badges) :** Baloo 2 ou Fredoka pour des éléments ludiques.

## 🎥 Motion & micro-interactions

- Transitions fluides et spring animations (type easing-out).
- L'œil/chouette peut cligner doucement lors du chargement.
- Les boutons utilisent de légères animations de rebond pour renforcer la sensation de réactivité.
- Apparition des éléments par fade-in + scale-up (à 1.05 puis retour à 1).

## 🪶 Style général

- Design doux, positif et bienveillant.
- Formes arrondies, coins généreux (border-radius: 2xl).
- Utilisation d'illustrations vectorielles simples et expressives.
- Interface modulable en mode clair/sombre.

### Thèmes

Le thème par défaut est neutre et mixte, avec deux variantes additionnelles prévues :

- **Thème Kids Boy** (plus bleu-vert)
- **Thème Kids Girl** (plus rose-corail doux)

## 📝 Notes d'implémentation

### Nom commercial vs nom technique

- **mOOtify** : Nom commercial utilisé côté frontend/marketing
- **RoutineStars** : Nom technique conservé dans les fichiers de configuration backend

### Structure des fichiers

- Documentation : `/BRAND_IDENTITY.md`
- Composants de branding : `/packages/web/src/components/branding/`
- Système de thèmes : `/packages/web/src/styles/themes.css` + `/packages/web/src/stores/themeStore.js`
- Animations : `/packages/web/src/components/animations/`


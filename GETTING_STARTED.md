# 🚀 Guide de démarrage rapide - mOOtify (routinestars)

Ce guide vous aidera à lancer mOOtify en moins de 10 minutes.

> *Chaque effort compte* ✨

## ⚡ Installation rapide

### 1. Prérequis (5 min)

#### Installer Node.js et pnpm

**Windows :**
```powershell
# Télécharger Node.js 20 LTS depuis nodejs.org
# Puis installer pnpm
npm install -g pnpm
```

**macOS/Linux :**
```bash
# Avec nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Installer pnpm
npm install -g pnpm
```

#### Créer une base de données Supabase (gratuit)

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte gratuit
3. Créer un nouveau projet :
   - Nom : `routinestars`
   - Mot de passe : (garder en sécurité)
   - Region : choisir la plus proche
4. Attendre 2 minutes que le projet soit créé
5. Aller dans **Settings → Database**
6. Copier la "Connection string" (URI)

### 2. Configuration (2 min)

```bash
# Cloner le projet
git clone <votre-repo>
cd routinestars

# Installer toutes les dépendances
pnpm install
```

**Créer les fichiers de configuration :**

**Backend :** Créer `packages/api/.env`
```bash
DATABASE_URL="postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.[VOTRE-PROJET].supabase.co:5432/postgres"
JWT_SECRET="ma-cle-super-secrete-a-changer-en-production"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

**Frontend :** Créer `packages/web/.env`
```bash
VITE_API_URL=http://localhost:3001/api
```

### 3. Initialiser la base de données (1 min)

```bash
# Depuis la racine du projet
pnpm db:push
```

✅ Vérifier que tout est OK : vous devriez voir "Your database is now in sync with your schema."

### 4. Lancer l'application (30 sec)

```bash
# Lancer API + Frontend en même temps
pnpm dev
```

Vous devriez voir :
```
🚀 RoutineStars API running on http://localhost:3001
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

## 🎉 Première utilisation

### Créer votre compte parent

1. Ouvrir http://localhost:5173
2. Cliquer sur **"Mode Parent"**
3. Cliquer sur **"S'inscrire"**
4. Remplir :
   - Email : votre email
   - Mot de passe : au moins 8 caractères
   - Nom : votre prénom
5. Cliquer sur **"Créer mon compte"**

### Ajouter votre premier enfant

1. Une fois connecté, aller dans **"Enfants"**
2. Cliquer sur **"Ajouter un enfant"**
3. Remplir :
   - Prénom : ex: "Samir"
   - Âge : ex: 7
   - Code PIN : 4 chiffres faciles (ex: 1234)
4. Cliquer sur **"Créer"**

### Tester la connexion enfant

1. Se déconnecter (bouton en bas à gauche)
2. Sur la page de login, cliquer **"Mode Enfant"**
3. Cliquer sur le profil de l'enfant
4. Entrer le code PIN
5. ✅ Vous êtes dans l'interface enfant !

## 🛠️ Commandes utiles

```bash
# Développement
pnpm dev              # Tout lancer en parallèle
pnpm dev:api          # API seulement
pnpm dev:web          # Web seulement

# Base de données
pnpm db:studio        # Interface visuelle de la DB
pnpm db:push          # Mettre à jour le schéma

# Debugging
# Voir les logs de l'API dans le terminal
# Ouvrir les DevTools du navigateur (F12) pour le frontend
```

## ⚠️ Problèmes courants

### Erreur "pnpm: command not found"
```bash
npm install -g pnpm
```

### Erreur de connexion à la base de données
- Vérifier que l'URL dans `.env` est correcte
- Vérifier que le mot de passe ne contient pas de caractères spéciaux non encodés
- Encoder les caractères spéciaux : `@` → `%40`, `#` → `%23`

### Port 3001 ou 5173 déjà utilisé
```bash
# Changer le port dans packages/api/.env
PORT=3002

# Changer le port dans packages/web/vite.config.js
server: { port: 5174 }
```

### Erreur Prisma "Client not generated"
```bash
cd packages/api
npx prisma generate
```

## 📱 Accès depuis mobile (même réseau WiFi)

1. Trouver votre IP locale :
   ```bash
   # Windows
   ipconfig
   # macOS/Linux
   ifconfig
   ```

2. Modifier `packages/web/.env` :
   ```bash
   VITE_API_URL=http://192.168.1.X:3001/api
   ```

3. Modifier `packages/api/.env` :
   ```bash
   CORS_ORIGIN="http://192.168.1.X:5173"
   ```

4. Redémarrer :
   ```bash
   pnpm dev
   ```

5. Ouvrir depuis mobile : `http://192.168.1.X:5173`

## 📚 Prochaines étapes

1. ✅ Lire le [README.md](./README.md) complet
2. 🔍 Explorer le code dans `packages/`
3. 🎨 Personnaliser les couleurs dans `packages/web/tailwind.config.js`
4. 🚀 Ajouter vos premières tâches !

## 🆘 Besoin d'aide ?

- Consulter la [documentation complète](./README.md)
- Ouvrir une issue sur GitHub
- Vérifier les logs dans le terminal

---

**Bon développement ! 🎉**


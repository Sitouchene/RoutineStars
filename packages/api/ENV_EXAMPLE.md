# Configuration des variables d'environnement

Créer un fichier `.env` à la racine de `packages/api/` avec :

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/routinestars?schema=public"

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET="votre-cle-secrete-tres-longue-et-aleatoire"
JWT_EXPIRES_IN="24h"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```



# Configuration Déploiement Render.com

## Variables d'Environnement

### DATABASE_URL (Connection Pooler - PgBouncer)
Pour éviter l'erreur "prepared statement does not exist", ajouter `?pgbouncer=true&connection_limit=1` à votre URL Supabase poolée:

```
postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1
```

⚠️ **Important**: Utiliser le port `6543` (pooler) et non `5432` (direct)

### DIRECT_URL (Direct Connection)
Pour les migrations uniquement, utiliser la connexion directe Supabase (port 5432):

```
postgresql://user:password@host:5432/postgres
```

### Autres Variables
```
JWT_SECRET=votre-cle-secrete-longue-et-aleatoire
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://routinestars.vercel.app
```

## Build Command
```bash
pnpm install && pnpm run db:generate
```

## Start Command
```bash
pnpm run start
```

## Deploy Command (après push GitHub)
```bash
pnpm run prisma:deploy
```

## Troubleshooting

### Erreur "prepared statement does not exist"
- Vérifier que `DATABASE_URL` contient `?pgbouncer=true&connection_limit=1`
- Vérifier que le port est `6543` (pooler)
- Redémarrer le service Render.com après modification

### Migrations échouent
- Utiliser `DIRECT_URL` (port 5432) pour les migrations
- Exécuter `prisma migrate deploy` avec `DIRECT_URL` configuré

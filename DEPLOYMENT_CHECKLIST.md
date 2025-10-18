# Checklist Déploiement Production

## Backend (Render.com)

1. **Variables d'environnement**
   - [ ] `DATABASE_URL` avec `?pgbouncer=true&connection_limit=1` (port 6543)
   - [ ] `DIRECT_URL` pour migrations (port 5432)
   - [ ] `JWT_SECRET` (générer une clé sécurisée)
   - [ ] `JWT_EXPIRES_IN=24h`
   - [ ] `NODE_ENV=production`
   - [ ] `CORS_ORIGIN=https://routinestars.vercel.app`

2. **Build Settings**
   - Build Command: `pnpm install && pnpm run db:generate`
   - Start Command: `pnpm run start`

3. **Post-Déploiement**
   - Exécuter: `pnpm run prisma:deploy` (dans Render shell)
   - Vérifier: `pnpm run verify:config`

## Frontend (Vercel)

1. **Variables d'environnement**
   - [ ] `VITE_API_URL=https://routinestars.onrender.com/api`

2. **Build Settings**
   - Build Command: `cd packages/web && pnpm install && pnpm run build`
   - Output Directory: `packages/web/dist`

## Tests Post-Déploiement

1. [ ] Dashboard parent charge sans erreur
2. [ ] Catégories se chargent
3. [ ] Livres se chargent
4. [ ] Scanner QR fonctionne
5. [ ] Lien QR externe fonctionne

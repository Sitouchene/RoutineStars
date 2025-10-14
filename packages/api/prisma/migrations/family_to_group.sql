-- Migration: Family → Group avec types d'usage
-- Cette migration transforme la table families en groups et ajoute les nouveaux champs

-- 1. Créer la nouvelle table groups
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'family',
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- 2. Générer des codes pour les familles existantes
INSERT INTO "groups" ("id", "type", "name", "code", "language", "createdAt", "updatedAt")
SELECT 
    "id",
    'family' as "type",
    "name",
    'FAMILY_' || SUBSTRING("id", 1, 8) as "code",
    'fr' as "language",
    "createdAt",
    "updatedAt"
FROM "families";

-- 3. Ajouter les nouvelles colonnes aux tables existantes
ALTER TABLE "categories" ADD COLUMN "groupId" TEXT;
ALTER TABLE "users" ADD COLUMN "groupId" TEXT;
ALTER TABLE "users" ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "task_templates" ADD COLUMN "groupId" TEXT;
ALTER TABLE "daily_messages" ADD COLUMN "groupId" TEXT;
ALTER TABLE "evaluation_windows" ADD COLUMN "groupId" TEXT;

-- 4. Mettre à jour les références
UPDATE "categories" SET "groupId" = "familyId";
UPDATE "users" SET "groupId" = "familyId";
UPDATE "task_templates" SET "groupId" = "familyId";
UPDATE "daily_messages" SET "groupId" = "familyId";
UPDATE "evaluation_windows" SET "groupId" = "familyId";

-- 5. Ajouter les contraintes de clés étrangères
ALTER TABLE "categories" ADD CONSTRAINT "categories_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "task_templates" ADD CONSTRAINT "task_templates_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_messages" ADD CONSTRAINT "daily_messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evaluation_windows" ADD CONSTRAINT "evaluation_windows_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 6. Ajouter l'index unique pour le code
CREATE UNIQUE INDEX "groups_code_key" ON "groups"("code");

-- 7. Supprimer les anciennes colonnes et contraintes
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_familyId_fkey";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_familyId_fkey";
ALTER TABLE "task_templates" DROP CONSTRAINT IF EXISTS "task_templates_familyId_fkey";
ALTER TABLE "daily_messages" DROP CONSTRAINT IF EXISTS "daily_messages_familyId_fkey";
ALTER TABLE "evaluation_windows" DROP CONSTRAINT IF EXISTS "evaluation_windows_familyId_fkey";

ALTER TABLE "categories" DROP COLUMN "familyId";
ALTER TABLE "users" DROP COLUMN "familyId";
ALTER TABLE "task_templates" DROP COLUMN "familyId";
ALTER TABLE "daily_messages" DROP COLUMN "familyId";
ALTER TABLE "evaluation_windows" DROP COLUMN "familyId";

-- 8. Supprimer l'ancienne table families
DROP TABLE "families";

-- 9. Mettre à jour la table de migration Prisma
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES (
  'family-to-group-' || extract(epoch from now())::text,
  'family_to_group_migration',
  now(),
  'family_to_group',
  '[]',
  null,
  now(),
  1
) ON CONFLICT DO NOTHING;

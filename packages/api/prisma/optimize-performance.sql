-- Script d'optimisation des performances de la base de données
-- À exécuter dans Supabase SQL Editor

-- ==============================================
-- 1. INDEX POUR LES CLÉS ÉTRANGÈRES MANQUANTES
-- ==============================================

-- Index pour daily_messages.childId
CREATE INDEX IF NOT EXISTS "idx_daily_messages_childId" 
ON "public"."daily_messages" ("childId");

-- Index pour evaluation_windows.childId  
CREATE INDEX IF NOT EXISTS "idx_evaluation_windows_childId"
ON "public"."evaluation_windows" ("childId");

-- Index pour rewards.userId
CREATE INDEX IF NOT EXISTS "idx_rewards_userId"
ON "public"."rewards" ("userId");

-- Index pour task_assignments.childId
CREATE INDEX IF NOT EXISTS "idx_task_assignments_childId"
ON "public"."task_assignments" ("childId");

-- Index pour task_assignments.taskTemplateId
CREATE INDEX IF NOT EXISTS "idx_task_assignments_taskTemplateId"
ON "public"."task_assignments" ("taskTemplateId");

-- Index pour task_templates.categoryId
CREATE INDEX IF NOT EXISTS "idx_task_templates_categoryId"
ON "public"."task_templates" ("categoryId");

-- Index pour tasks.taskTemplateId
CREATE INDEX IF NOT EXISTS "idx_tasks_taskTemplateId"
ON "public"."tasks" ("taskTemplateId");

-- ==============================================
-- 2. INDEX COMPOSITES POUR LES REQUÊTES FRÉQUENTES
-- ==============================================

-- Index composite pour les tâches par enfant et date
CREATE INDEX IF NOT EXISTS "idx_tasks_userId_date"
ON "public"."tasks" ("userId", "date");

-- Index composite pour les assignations par enfant et statut
CREATE INDEX IF NOT EXISTS "idx_task_assignments_childId_isActive"
ON "public"."task_assignments" ("childId", "isActive");

-- Index composite pour les soumissions par enfant et date
CREATE INDEX IF NOT EXISTS "idx_day_submissions_childId_date"
ON "public"."day_submissions" ("childId", "date");

-- Index composite pour les messages par groupe et date
CREATE INDEX IF NOT EXISTS "idx_daily_messages_groupId_date"
ON "public"."daily_messages" ("groupId", "date");

-- Index composite pour les tâches par groupe et statut
-- CREATE INDEX IF NOT EXISTS "idx_task_templates_groupId_isActive"
-- ON "public"."task_templates" ("groupId", "isActive");

-- ==============================================
-- 3. INDEX POUR LES REQUÊTES DE STATISTIQUES
-- ==============================================

-- Index pour les statistiques par enfant et période
CREATE INDEX IF NOT EXISTS "idx_tasks_userId_date_score"
ON "public"."tasks" ("userId", "date", "selfScore");

-- Index pour les récompenses par utilisateur et date
CREATE INDEX IF NOT EXISTS "idx_rewards_userId_earnedAt"
ON "public"."rewards" ("userId", "earnedAt");

-- ==============================================
-- 4. VÉRIFICATION DES INDEX CRÉÉS
-- ==============================================

-- Vérifier que tous les index ont été créés
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

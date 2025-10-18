-- Script d'activation du realtime Supabase
-- À exécuter dans Supabase SQL Editor

-- ==============================================
-- 1. ACTIVATION REALTIME - PHASE 1 (PRIORITÉ HAUTE)
-- ==============================================

-- Activer le realtime pour les tâches (autoévaluation, scores)
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."tasks";

-- Activer le realtime pour les soumissions quotidiennes
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."day_submissions";

-- ==============================================
-- 2. ACTIVATION REALTIME - PHASE 2 (PRIORITÉ MOYENNE)
-- ==============================================

-- Activer le realtime pour les messages quotidiens
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."daily_messages";

-- Activer le realtime pour les assignations de tâches
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."task_assignments";

-- ==============================================
-- 3. ACTIVATION REALTIME - PHASE 3 (PRIORITÉ BASSE)
-- ==============================================

-- Activer le realtime pour les récompenses
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."rewards";

-- ==============================================
-- 4. VÉRIFICATION DES TABLES REALTIME
-- ==============================================

-- Vérifier les tables activées pour le realtime
SELECT 
    schemaname,
    tablename,
    hasinserts,
    hasupdates,
    hasdeletes,
    hastruncates
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- ==============================================
-- 5. CONFIGURATION DES FILTRES DE SÉCURITÉ
-- ==============================================

-- Note: Les politiques RLS existantes protègent déjà les données
-- Le realtime respecte automatiquement les politiques RLS
-- Aucune configuration supplémentaire nécessaire

-- ==============================================
-- 6. MONITORING ET MAINTENANCE
-- ==============================================

-- Vérifier l'état du realtime
SELECT 
    name,
    enabled,
    created_at
FROM realtime.subscription 
WHERE name LIKE '%routine%' OR name LIKE '%task%' OR name LIKE '%message%';

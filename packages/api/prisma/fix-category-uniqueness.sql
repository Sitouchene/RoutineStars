-- Script pour corriger l'unicité des catégories
-- À exécuter dans Supabase SQL Editor

-- Supprimer l'ancienne contrainte d'unicité
ALTER TABLE "public"."categories" 
DROP CONSTRAINT IF EXISTS "category_title_unique";

-- Ajouter la nouvelle contrainte d'unicité composite
ALTER TABLE "public"."categories" 
ADD CONSTRAINT "category_group_title_unique" 
UNIQUE ("groupId", "title");

-- Vérifier que la contrainte a été appliquée
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.categories'::regclass 
AND conname = 'category_group_title_unique';

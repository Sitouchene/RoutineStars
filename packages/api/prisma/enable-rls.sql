-- Script pour activer Row Level Security (RLS) sur toutes les tables
-- À exécuter dans Supabase SQL Editor

-- Activer RLS sur toutes les tables principales
ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."task_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."task_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."day_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."rewards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."daily_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."evaluation_windows" ENABLE ROW LEVEL SECURITY;

-- Note: _prisma_migrations ne nécessite pas RLS car c'est une table système

-- Politiques RLS pour la table groups
CREATE POLICY "Users can view their own group" ON "public"."groups"
    FOR SELECT USING (auth.uid()::text = ANY(
        SELECT id FROM "public"."users" WHERE "groupId" = "groups"."id"
    ));

CREATE POLICY "Users can update their own group" ON "public"."groups"
    FOR UPDATE USING (auth.uid()::text = ANY(
        SELECT id FROM "public"."users" WHERE "groupId" = "groups"."id" AND role IN ('parent', 'teacher')
    ));

-- Politiques RLS pour la table users
CREATE POLICY "Users can view users in their group" ON "public"."users"
    FOR SELECT USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
        )
    );

CREATE POLICY "Parents can manage users in their group" ON "public"."users"
    FOR ALL USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" 
            WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
        )
    );

-- Politiques RLS pour la table categories
CREATE POLICY "Users can view categories in their group" ON "public"."categories"
    FOR SELECT USING (
        "isSystem" = true OR "groupId" IN (
            SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
        )
    );

CREATE POLICY "Parents can manage categories in their group" ON "public"."categories"
    FOR ALL USING (
        "isSystem" = false AND "groupId" IN (
            SELECT "groupId" FROM "public"."users" 
            WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
        )
    );

-- Politiques RLS pour la table task_templates
CREATE POLICY "Users can view task templates in their group" ON "public"."task_templates"
    FOR SELECT USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
        )
    );

CREATE POLICY "Parents can manage task templates in their group" ON "public"."task_templates"
    FOR ALL USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" 
            WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
        )
    );

-- Politiques RLS pour la table tasks
CREATE POLICY "Users can view tasks in their group" ON "public"."tasks"
    FOR SELECT USING (
        "userId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Children can manage their own tasks" ON "public"."tasks"
    FOR ALL USING (
        "userId" = auth.uid()::text AND "userId" IN (
            SELECT id FROM "public"."users" WHERE role IN ('child', 'student')
        )
    );

CREATE POLICY "Parents can manage tasks in their group" ON "public"."tasks"
    FOR ALL USING (
        "userId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" 
                WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
            )
        )
    );

-- Politiques RLS pour la table task_assignments
CREATE POLICY "Users can view assignments in their group" ON "public"."task_assignments"
    FOR SELECT USING (
        "childId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Parents can manage assignments in their group" ON "public"."task_assignments"
    FOR ALL USING (
        "childId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" 
                WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
            )
        )
    );

-- Politiques RLS pour la table day_submissions
CREATE POLICY "Users can view submissions in their group" ON "public"."day_submissions"
    FOR SELECT USING (
        "childId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Children can manage their own submissions" ON "public"."day_submissions"
    FOR ALL USING (
        "childId" = auth.uid()::text AND "childId" IN (
            SELECT id FROM "public"."users" WHERE role IN ('child', 'student')
        )
    );

CREATE POLICY "Parents can manage submissions in their group" ON "public"."day_submissions"
    FOR ALL USING (
        "childId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" 
                WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
            )
        )
    );

-- Politiques RLS pour la table rewards
CREATE POLICY "Users can view rewards in their group" ON "public"."rewards"
    FOR SELECT USING (
        "userId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Parents can manage rewards in their group" ON "public"."rewards"
    FOR ALL USING (
        "userId" IN (
            SELECT id FROM "public"."users" 
            WHERE "groupId" IN (
                SELECT "groupId" FROM "public"."users" 
                WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
            )
        )
    );

-- Politiques RLS pour la table daily_messages
CREATE POLICY "Users can view messages in their group" ON "public"."daily_messages"
    FOR SELECT USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
        )
    );

CREATE POLICY "Parents can manage messages in their group" ON "public"."daily_messages"
    FOR ALL USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" 
            WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
        )
    );

-- Politiques RLS pour la table evaluation_windows
CREATE POLICY "Users can view evaluation windows in their group" ON "public"."evaluation_windows"
    FOR SELECT USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" WHERE id = auth.uid()::text
        )
    );

CREATE POLICY "Parents can manage evaluation windows in their group" ON "public"."evaluation_windows"
    FOR ALL USING (
        "groupId" IN (
            SELECT "groupId" FROM "public"."users" 
            WHERE id = auth.uid()::text AND role IN ('parent', 'teacher')
        )
    );

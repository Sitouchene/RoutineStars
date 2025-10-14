-- Add recurrence fields to task_assignments table
-- These fields are needed for the new recurrence logic

ALTER TABLE "task_assignments" 
ADD COLUMN IF NOT EXISTS "recurrence" TEXT,
ADD COLUMN IF NOT EXISTS "recurrenceDays" TEXT,
ADD COLUMN IF NOT EXISTS "recurrenceStartDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "recurrenceInterval" INTEGER;

-- Update the migration history table to mark this migration as applied
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES (
  'add-assignment-recurrence-' || extract(epoch from now())::text,
  'add_recurrence_fields',
  now(),
  'add_assignment_recurrence',
  '[]',
  null,
  now(),
  1
) ON CONFLICT DO NOTHING;

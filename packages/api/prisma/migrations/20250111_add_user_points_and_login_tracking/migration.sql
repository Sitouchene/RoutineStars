-- Add new fields to users table
ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "totalPointsEarned" INTEGER NOT NULL DEFAULT 0;

-- Add pointsEarned field to day_submissions table
ALTER TABLE "day_submissions" ADD COLUMN "pointsEarned" INTEGER NOT NULL DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX "idx_users_groupId_role" ON "users"("groupId", "role");
CREATE INDEX "idx_users_groupId_lastLoginAt" ON "users"("groupId", "lastLoginAt");
CREATE INDEX "idx_users_totalPointsEarned" ON "users"("totalPointsEarned");
CREATE INDEX "idx_day_submissions_validatedAt" ON "day_submissions"("validatedAt");
CREATE INDEX "idx_day_submissions_pointsEarned" ON "day_submissions"("pointsEarned");


-- Add moderation fields to ProblemStatement
ALTER TABLE "ProblemStatement" ADD COLUMN "moderationStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ProblemStatement" ADD COLUMN "moderationComment" TEXT;
ALTER TABLE "ProblemStatement" ADD COLUMN "moderatedAt" TIMESTAMP(3);
ALTER TABLE "ProblemStatement" ADD COLUMN "moderatedById" TEXT;

-- Add ban fields to User
ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "banReason" TEXT;
ALTER TABLE "User" ADD COLUMN "banExpiry" TIMESTAMP(3);

-- Add foreign key for moderation
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
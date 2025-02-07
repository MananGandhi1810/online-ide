-- AlterTable
ALTER TABLE "ProblemStatement" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

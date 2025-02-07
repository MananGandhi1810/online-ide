/*
  Warnings:

  - Made the column `createdById` on table `ProblemStatement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProblemStatement" DROP CONSTRAINT "ProblemStatement_createdById_fkey";

-- AlterTable
ALTER TABLE "ProblemStatement" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

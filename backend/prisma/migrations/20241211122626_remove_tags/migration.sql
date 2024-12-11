/*
  Warnings:

  - You are about to drop the `ProblemTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProblemStatement" DROP CONSTRAINT "ProblemStatement_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemTag" DROP CONSTRAINT "ProblemTag_problemId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemTag" DROP CONSTRAINT "ProblemTag_tagId_fkey";

-- DropTable
DROP TABLE "ProblemTag";

-- DropTable
DROP TABLE "Tag";

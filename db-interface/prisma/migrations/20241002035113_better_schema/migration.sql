/*
  Warnings:

  - You are about to drop the column `hiddenTestCasesId` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the column `testCasesId` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the `TestCases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `ProblemStatement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProblemStatement" DROP CONSTRAINT "ProblemStatement_hiddenTestCasesId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemStatement" DROP CONSTRAINT "ProblemStatement_testCasesId_fkey";

-- AlterTable
ALTER TABLE "ProblemStatement" DROP COLUMN "hiddenTestCasesId",
DROP COLUMN "name",
DROP COLUMN "testCasesId",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "TestCases";

-- CreateTable
CREATE TABLE "Testcase" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT true,
    "problemStatementId" TEXT NOT NULL,

    CONSTRAINT "Testcase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

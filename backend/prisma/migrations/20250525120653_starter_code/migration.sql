-- CreateTable
CREATE TABLE "StarterCode" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "problemStatementId" TEXT NOT NULL,

    CONSTRAINT "StarterCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StarterCode_problemStatementId_language_key" ON "StarterCode"("problemStatementId", "language");

-- AddForeignKey
ALTER TABLE "StarterCode" ADD CONSTRAINT "StarterCode_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

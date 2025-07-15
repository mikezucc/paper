-- CreateTable
CREATE TABLE "PaperRevision" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "content" TEXT,
    "tags" TEXT[],
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaperRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaperRevision_paperId_idx" ON "PaperRevision"("paperId");

-- CreateIndex
CREATE INDEX "PaperRevision_createdAt_idx" ON "PaperRevision"("createdAt");

-- AddForeignKey
ALTER TABLE "PaperRevision" ADD CONSTRAINT "PaperRevision_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
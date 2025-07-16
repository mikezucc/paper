-- CreateTable
CREATE TABLE "PublishedVersion" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "revisionId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "content" TEXT,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublishedVersion_slug_key" ON "PublishedVersion"("slug");

-- CreateIndex
CREATE INDEX "PublishedVersion_paperId_idx" ON "PublishedVersion"("paperId");

-- CreateIndex
CREATE INDEX "PublishedVersion_slug_idx" ON "PublishedVersion"("slug");

-- CreateIndex
CREATE INDEX "PublishedVersion_publishedAt_idx" ON "PublishedVersion"("publishedAt");

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "PaperRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

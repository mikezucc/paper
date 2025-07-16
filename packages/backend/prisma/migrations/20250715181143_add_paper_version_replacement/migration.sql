-- AlterTable
ALTER TABLE "Paper" ADD COLUMN "canonicalPublishedVersionId" TEXT;

-- AlterTable
ALTER TABLE "PublishedVersion" ADD COLUMN "replacedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Paper_canonicalPublishedVersionId_key" ON "Paper"("canonicalPublishedVersionId");

-- CreateIndex
CREATE INDEX "PublishedVersion_replacedById_idx" ON "PublishedVersion"("replacedById");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_canonicalPublishedVersionId_fkey" FOREIGN KEY ("canonicalPublishedVersionId") REFERENCES "PublishedVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_replacedById_fkey" FOREIGN KEY ("replacedById") REFERENCES "PublishedVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
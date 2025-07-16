-- AlterTable
ALTER TABLE "PaperRevision" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "autoDescription" TEXT;

-- CreateIndex
CREATE INDEX "PaperRevision_authorId_idx" ON "PaperRevision"("authorId");

-- AddForeignKey
ALTER TABLE "PaperRevision" ADD CONSTRAINT "PaperRevision_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

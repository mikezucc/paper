-- AlterTable
ALTER TABLE "Paper" ADD COLUMN "content" TEXT;

-- Drop the contentKey column
ALTER TABLE "Paper" DROP COLUMN "contentKey";
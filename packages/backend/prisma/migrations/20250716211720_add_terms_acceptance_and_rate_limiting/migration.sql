-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastVerificationCodeSentAt" TIMESTAMP(3),
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3);

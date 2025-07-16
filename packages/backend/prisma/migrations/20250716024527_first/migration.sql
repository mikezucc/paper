-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "totpSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "content" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "canonicalPublishedVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

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
    "replacedById" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewRecord" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_slug_key" ON "Paper"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_canonicalPublishedVersionId_key" ON "Paper"("canonicalPublishedVersionId");

-- CreateIndex
CREATE INDEX "Paper_userId_idx" ON "Paper"("userId");

-- CreateIndex
CREATE INDEX "Paper_slug_idx" ON "Paper"("slug");

-- CreateIndex
CREATE INDEX "Paper_published_idx" ON "Paper"("published");

-- CreateIndex
CREATE INDEX "Paper_tags_idx" ON "Paper"("tags");

-- CreateIndex
CREATE INDEX "PaperRevision_paperId_idx" ON "PaperRevision"("paperId");

-- CreateIndex
CREATE INDEX "PaperRevision_createdAt_idx" ON "PaperRevision"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedVersion_slug_key" ON "PublishedVersion"("slug");

-- CreateIndex
CREATE INDEX "PublishedVersion_paperId_idx" ON "PublishedVersion"("paperId");

-- CreateIndex
CREATE INDEX "PublishedVersion_slug_idx" ON "PublishedVersion"("slug");

-- CreateIndex
CREATE INDEX "PublishedVersion_publishedAt_idx" ON "PublishedVersion"("publishedAt");

-- CreateIndex
CREATE INDEX "PublishedVersion_replacedById_idx" ON "PublishedVersion"("replacedById");

-- CreateIndex
CREATE INDEX "ViewRecord_paperId_idx" ON "ViewRecord"("paperId");

-- CreateIndex
CREATE INDEX "ViewRecord_viewedAt_idx" ON "ViewRecord"("viewedAt");

-- CreateIndex
CREATE INDEX "ViewRecord_userId_idx" ON "ViewRecord"("userId");

-- CreateIndex
CREATE INDEX "ViewRecord_paperId_viewedAt_idx" ON "ViewRecord"("paperId", "viewedAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_canonicalPublishedVersionId_fkey" FOREIGN KEY ("canonicalPublishedVersionId") REFERENCES "PublishedVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperRevision" ADD CONSTRAINT "PaperRevision_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "PaperRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedVersion" ADD CONSTRAINT "PublishedVersion_replacedById_fkey" FOREIGN KEY ("replacedById") REFERENCES "PublishedVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewRecord" ADD CONSTRAINT "ViewRecord_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewRecord" ADD CONSTRAINT "ViewRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

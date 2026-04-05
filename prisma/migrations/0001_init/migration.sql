-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'youtube',
    "pageUrl" TEXT,
    "description" TEXT,
    "toneNotes" TEXT,
    "topicFocus" TEXT,
    "styleFingerprintJson" JSONB,
    "trustLevel" TEXT NOT NULL DEFAULT 'trusted',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#6366f1',
    "icon" TEXT DEFAULT 'folder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "title" TEXT NOT NULL,
    "creatorNameRaw" TEXT,
    "externalAuthor" TEXT,
    "thumbnailUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "rawText" TEXT,
    "transcriptText" TEXT,
    "extractedScreenshotText" TEXT,
    "shortSummary" TEXT,
    "detailedSummary" TEXT,
    "hookAnalysisJson" JSONB,
    "persuasionAngle" TEXT,
    "usefulVsFluffJson" JSONB,
    "businessTakeawaysJson" JSONB,
    "categorizationReasoning" TEXT,
    "tagsJson" JSONB,
    "energyStyle" TEXT,
    "audienceFit" TEXT,
    "similarityNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "needsTranscript" BOOLEAN NOT NULL DEFAULT false,
    "targetPublishDate" TIMESTAMP(3),
    "targetPlatform" TEXT,
    "projectId" TEXT,
    "savedCreatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItemCategory" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION,

    CONSTRAINT "ContentItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItemTag" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ContentItemTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedOutput" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT,
    "projectId" TEXT,
    "creatorId" TEXT,
    "outputType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "promptUsed" TEXT,
    "outputText" TEXT NOT NULL,
    "similarityScore" DOUBLE PRECISION,
    "originalityLevel" TEXT DEFAULT 'medium',
    "toneMode" TEXT DEFAULT 'educational',
    "contentMode" TEXT,
    "audience" TEXT,
    "feedbackStatus" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'draft',
    "targetPublishDate" TIMESTAMP(3),
    "targetPlatform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT,
    "generatedOutputId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendTopic" (
    "id" TEXT NOT NULL,
    "topicArea" TEXT NOT NULL,
    "source" TEXT,
    "headline" TEXT NOT NULL,
    "summary" TEXT,
    "sourceUrl" TEXT,
    "score" DOUBLE PRECISION,
    "isRising" BOOLEAN NOT NULL DEFAULT false,
    "isOverused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inputJson" JSONB,
    "outputJson" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "ContentItem_sourceType_idx" ON "ContentItem"("sourceType");

-- CreateIndex
CREATE INDEX "ContentItem_status_idx" ON "ContentItem"("status");

-- CreateIndex
CREATE INDEX "ContentItem_projectId_idx" ON "ContentItem"("projectId");

-- CreateIndex
CREATE INDEX "ContentItem_savedCreatorId_idx" ON "ContentItem"("savedCreatorId");

-- CreateIndex
CREATE INDEX "ContentItem_createdAt_idx" ON "ContentItem"("createdAt");

-- CreateIndex
CREATE INDEX "ContentItemCategory_contentItemId_idx" ON "ContentItemCategory"("contentItemId");

-- CreateIndex
CREATE INDEX "ContentItemCategory_categoryId_idx" ON "ContentItemCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItemCategory_contentItemId_categoryId_key" ON "ContentItemCategory"("contentItemId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "ContentItemTag_contentItemId_idx" ON "ContentItemTag"("contentItemId");

-- CreateIndex
CREATE INDEX "ContentItemTag_tagId_idx" ON "ContentItemTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItemTag_contentItemId_tagId_key" ON "ContentItemTag"("contentItemId", "tagId");

-- CreateIndex
CREATE INDEX "GeneratedOutput_outputType_idx" ON "GeneratedOutput"("outputType");

-- CreateIndex
CREATE INDEX "GeneratedOutput_contentItemId_idx" ON "GeneratedOutput"("contentItemId");

-- CreateIndex
CREATE INDEX "GeneratedOutput_reviewStatus_idx" ON "GeneratedOutput"("reviewStatus");

-- CreateIndex
CREATE INDEX "GeneratedOutput_projectId_idx" ON "GeneratedOutput"("projectId");

-- CreateIndex
CREATE INDEX "GeneratedOutput_creatorId_idx" ON "GeneratedOutput"("creatorId");

-- CreateIndex
CREATE INDEX "GeneratedOutput_createdAt_idx" ON "GeneratedOutput"("createdAt");

-- CreateIndex
CREATE INDEX "Note_contentItemId_idx" ON "Note"("contentItemId");

-- CreateIndex
CREATE INDEX "Note_generatedOutputId_idx" ON "Note"("generatedOutputId");

-- CreateIndex
CREATE INDEX "TrendTopic_topicArea_idx" ON "TrendTopic"("topicArea");

-- CreateIndex
CREATE INDEX "ProcessingJob_status_idx" ON "ProcessingJob"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_savedCreatorId_fkey" FOREIGN KEY ("savedCreatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItemCategory" ADD CONSTRAINT "ContentItemCategory_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItemCategory" ADD CONSTRAINT "ContentItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItemTag" ADD CONSTRAINT "ContentItemTag_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItemTag" ADD CONSTRAINT "ContentItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedOutput" ADD CONSTRAINT "GeneratedOutput_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedOutput" ADD CONSTRAINT "GeneratedOutput_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedOutput" ADD CONSTRAINT "GeneratedOutput_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_generatedOutputId_fkey" FOREIGN KEY ("generatedOutputId") REFERENCES "GeneratedOutput"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "modelProvider" TEXT,
    "modelId" TEXT,
    "promptVersion" TEXT,
    "result" JSONB,
    "errorMessage" TEXT,
    "requestedBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysisEvidence" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "questionKey" TEXT,
    "excerpt" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AiAnalysisEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreparationPlan" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "basedOnAnalysisId" TEXT,
    "modelProvider" TEXT,
    "modelId" TEXT,
    "result" JSONB,
    "errorMessage" TEXT,
    "requestedBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreparationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiAnalysis_applicationId_idx" ON "AiAnalysis"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "AiAnalysis_applicationId_version_key" ON "AiAnalysis"("applicationId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "PreparationPlan_applicationId_version_key" ON "PreparationPlan"("applicationId", "version");

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysisEvidence" ADD CONSTRAINT "AiAnalysisEvidence_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AiAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationPlan" ADD CONSTRAINT "PreparationPlan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

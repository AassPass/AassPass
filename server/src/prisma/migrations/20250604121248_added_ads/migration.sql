-- CreateEnum
CREATE TYPE "AdCategory" AS ENUM ('EVENT', 'DEAL', 'ACTIVITY', 'OFFER', 'SERVICE');

-- CreateEnum
CREATE TYPE "AdStage" AS ENUM ('DRAFT', 'SAVED');

-- CreateTable
CREATE TABLE "Ads" (
    "id" TEXT NOT NULL,
    "adCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "AdCategory" NOT NULL,
    "visibleFrom" TIMESTAMP(3) NOT NULL,
    "visibleTo" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "stage" "AdStage" NOT NULL,
    "reset" BOOLEAN NOT NULL DEFAULT false,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Ads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

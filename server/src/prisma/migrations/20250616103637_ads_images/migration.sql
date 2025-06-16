/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Ads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ads" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "AdImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "adId" TEXT NOT NULL,

    CONSTRAINT "AdImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdImage_adId_idx" ON "AdImage"("adId");

-- AddForeignKey
ALTER TABLE "AdImage" ADD CONSTRAINT "AdImage_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

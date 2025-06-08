/*
  Warnings:

  - You are about to drop the column `adCode` on the `Ads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adId]` on the table `Ads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adId` to the `Ads` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Ads_adCode_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "mobile" TEXT NOT NULL DEFAULT '0000000000';

-- AlterTable
ALTER TABLE "Ads" DROP COLUMN "adCode",
ADD COLUMN     "adId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ads_adId_key" ON "Ads"("adId");

/*
  Warnings:

  - A unique constraint covering the columns `[adCode]` on the table `Ads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ads_adCode_key" ON "Ads"("adCode");

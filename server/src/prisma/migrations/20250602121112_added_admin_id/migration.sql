/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "adminId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminId_key" ON "Admin"("adminId");

-- CreateEnum
CREATE TYPE "AdImageType" AS ENUM ('BANNER', 'NORMAL');

-- AlterTable
ALTER TABLE "AdImage" ADD COLUMN     "type" "AdImageType" NOT NULL DEFAULT 'NORMAL';

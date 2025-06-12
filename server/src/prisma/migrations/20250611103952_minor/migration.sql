-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_createdById_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

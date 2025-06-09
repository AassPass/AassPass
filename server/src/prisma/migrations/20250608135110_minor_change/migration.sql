/*
  Warnings:

  - The values [EVENT,DEAL,ACTIVITY,OFFER,SERVICE] on the enum `AdCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [RESTAURANT,CAFE,BAKERY,BAR,GYM,OTHER,Retail] on the enum `BusinessType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FREE] on the enum `SubscriptionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdCategory_new" AS ENUM ('Deals & Discounts', 'Events', 'Services', 'Products for Sale', 'Job Openings', 'Rentals & Properties', 'Announcements', 'Contests & Giveaways');
ALTER TABLE "Ads" ALTER COLUMN "category" TYPE "AdCategory_new" USING ("category"::text::"AdCategory_new");
ALTER TYPE "AdCategory" RENAME TO "AdCategory_old";
ALTER TYPE "AdCategory_new" RENAME TO "AdCategory";
DROP TYPE "AdCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BusinessType_new" AS ENUM ('Retail Store', 'Restaurant / Café', 'Salon / Spa', 'Gym / Fitness Center', 'Medical / Health Store', 'Service Provider', 'Freelancer / Consultant', 'Event Organizer', 'Education / Coaching', 'Home-based Business', 'Real Estate / Rentals', 'Courier / Delivery', 'Automobile Services', 'Pet Services', 'NGO / Community Org.', 'Shop/Store/Office', 'Other');
ALTER TABLE "Business" ALTER COLUMN "businessType" TYPE "BusinessType_new" USING ("businessType"::text::"BusinessType_new");
ALTER TYPE "BusinessType" RENAME TO "BusinessType_old";
ALTER TYPE "BusinessType_new" RENAME TO "BusinessType";
DROP TYPE "BusinessType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('STANDARD', 'PREMIUM');
ALTER TABLE "Business" ALTER COLUMN "subscriptionType" TYPE "SubscriptionType_new" USING ("subscriptionType"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "SubscriptionType_old";
COMMIT;

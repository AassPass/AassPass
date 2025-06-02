-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('HOLD', 'APPROVED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'CAFE', 'BAKERY', 'BAR', 'GYM', 'OTHER');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL,
    "subscriptionType" "SubscriptionType" NOT NULL,
    "gstNumber" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessId_key" ON "Business"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_emailAddress_key" ON "Business"("emailAddress");

-- CreateIndex
CREATE INDEX "Business_businessId_idx" ON "Business"("businessId");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

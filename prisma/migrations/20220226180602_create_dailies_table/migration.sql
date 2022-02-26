/*
  Warnings:

  - You are about to drop the `DonationKeys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DonationKeys";

-- CreateTable
CREATE TABLE "premium_keys" (
    "activeIn" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expiresAt" VARCHAR(255) NOT NULL,
    "metadata" VARCHAR(255) NOT NULL,

    CONSTRAINT "premium_keys_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "dailies" (
    "receivedById" VARCHAR(255) NOT NULL,
    "receivedAt" VARCHAR(255) NOT NULL,
    "ip" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "userAgent" VARCHAR(255) NOT NULL,

    CONSTRAINT "dailies_pkey" PRIMARY KEY ("receivedById")
);

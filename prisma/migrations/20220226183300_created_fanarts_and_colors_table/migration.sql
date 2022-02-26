/*
  Warnings:

  - Added the required column `rarity` to the `banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banner" ADD COLUMN     "rarity" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "achievements" (
    "user" VARCHAR(255) NOT NULL,
    "type" TEXT NOT NULL,
    "achieved_at" TEXT NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "fanarts" (
    "user" VARCHAR(255) NOT NULL,
    "id" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fanarts_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "Colors" (
    "id" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Colors_pkey" PRIMARY KEY ("id")
);

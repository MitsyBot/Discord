/*
  Warnings:

  - You are about to drop the `Colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fanarts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Colors";

-- DropTable
DROP TABLE "banner";

-- DropTable
DROP TABLE "client";

-- DropTable
DROP TABLE "fanarts";

-- CreateTable
CREATE TABLE "mitsy_client" (
    "id" VARCHAR(255) NOT NULL DEFAULT E'790760362060283974',
    "userBlocklist" TEXT[],
    "guildBlocklist" TEXT[],

    CONSTRAINT "mitsy_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_backgrounds" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL DEFAULT 1,
    "authorId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shop_backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitsy_fanarts" (
    "user" VARCHAR(255) NOT NULL,
    "id" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "mitsy_fanarts_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "shop_colors" (
    "id" TEXT NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shop_colors_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the `GuildProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuildProfile";

-- CreateTable
CREATE TABLE "guild_profiles" (
    "guild" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "xp" DOUBLE PRECISION NOT NULL,
    "level" DOUBLE PRECISION NOT NULL,
    "isInGuild" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "guild_profiles_pkey" PRIMARY KEY ("user")
);

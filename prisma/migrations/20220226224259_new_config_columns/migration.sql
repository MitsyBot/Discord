/*
  Warnings:

  - You are about to drop the `guild_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "guild_config";

-- CreateTable
CREATE TABLE "GuildProfile" (
    "guild" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "xp" DOUBLE PRECISION NOT NULL,
    "level" DOUBLE PRECISION NOT NULL,
    "isInGuild" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GuildProfile_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "guild_general" (
    "id" TEXT NOT NULL,
    "blacklisted_channels" TEXT[],
    "custom_commands" TEXT[],
    "disabled_commands" TEXT[],
    "lang" TEXT NOT NULL DEFAULT E'pt-BR',
    "prefix" TEXT NOT NULL DEFAULT E'-',
    "custom_warn_message" BOOLEAN NOT NULL DEFAULT false,
    "blacklisted_warning" TEXT NOT NULL,

    CONSTRAINT "guild_general_pkey" PRIMARY KEY ("id")
);

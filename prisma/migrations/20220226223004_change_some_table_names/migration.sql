/*
  Warnings:

  - You are about to drop the `GuildConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCooldowns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuildConfig";

-- DropTable
DROP TABLE "UserCooldowns";

-- CreateTable
CREATE TABLE "user_cooldowns" (
    "id" TEXT NOT NULL,
    "last_daily" TIMESTAMP(3) NOT NULL,
    "last_rep" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_cooldowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_config" (
    "id" TEXT NOT NULL,
    "blacklisted_channels" TEXT[],
    "custom_commands" TEXT[],
    "lang" TEXT NOT NULL DEFAULT E'pt-BR',

    CONSTRAINT "guild_config_pkey" PRIMARY KEY ("id")
);

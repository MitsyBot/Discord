/*
  Warnings:

  - You are about to drop the column `badges_list` on the `user_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "badges_list",
ADD COLUMN     "badge_list" TEXT[];

-- CreateTable
CREATE TABLE "UserCooldowns" (
    "id" TEXT NOT NULL,
    "last_daily" TIMESTAMP(3) NOT NULL,
    "last_rep" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCooldowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildConfig" (
    "id" TEXT NOT NULL,
    "blacklisted_channels" TEXT[],
    "custom_commands" TEXT[],
    "lang" TEXT NOT NULL DEFAULT E'pt-BR',

    CONSTRAINT "GuildConfig_pkey" PRIMARY KEY ("id")
);

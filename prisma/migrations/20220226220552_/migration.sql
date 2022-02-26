/*
  Warnings:

  - The `received_at` column on the `dailies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `guild_blacklist` on the `mitsy_client` table. All the data in the column will be lost.
  - You are about to drop the column `user_blacklist` on the `mitsy_client` table. All the data in the column will be lost.
  - You are about to drop the column `remind_at` on the `reminders` table. All the data in the column will be lost.
  - The `received_at` column on the `reputations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `metadata` on the `premium_keys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expires_at` on the `premium_keys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "dailies" DROP COLUMN "received_at",
ADD COLUMN     "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "mitsy_client" DROP COLUMN "guild_blacklist",
DROP COLUMN "user_blacklist",
ADD COLUMN     "maintenance" TEXT[];

-- AlterTable
ALTER TABLE "premium_keys" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSON NOT NULL,
DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "remind_at";

-- AlterTable
ALTER TABLE "reputations" DROP COLUMN "received_at",
ADD COLUMN     "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "premium_payments" (
    "user" VARCHAR(255) NOT NULL,
    "gateway" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "reference_id" UUID NOT NULL,
    "metadata" JSON NOT NULL,

    CONSTRAINT "premium_payments_pkey" PRIMARY KEY ("reference_id")
);

-- CreateTable
CREATE TABLE "blacklisted_guilds" (
    "guild" TEXT NOT NULL,
    "bannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,

    CONSTRAINT "blacklisted_guilds_pkey" PRIMARY KEY ("guild")
);

-- CreateTable
CREATE TABLE "banned_users" (
    "user" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "banned_by" TEXT NOT NULL,

    CONSTRAINT "banned_users_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "user_connections" (
    "id" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" TEXT[],
    "config" TEXT[],

    CONSTRAINT "user_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "comets" DOUBLE PRECISION NOT NULL,
    "global_xp" DOUBLE PRECISION NOT NULL,
    "global_level" DOUBLE PRECISION NOT NULL,
    "aboutme" TEXT NOT NULL,
    "total_reps" DOUBLE PRECISION NOT NULL,
    "active_background" TEXT NOT NULL,
    "backgrounds" TEXT[],
    "active_profile_design" TEXT NOT NULL,
    "profiles" TEXT[],
    "active_badges" TEXT[],
    "badges_list" TEXT[],
    "active_colors" TEXT[],
    "color" TEXT NOT NULL,
    "isAfk" BOOLEAN NOT NULL DEFAULT false,
    "afkReason" TEXT NOT NULL,
    "married" BOOLEAN NOT NULL DEFAULT false,
    "married_user" TEXT NOT NULL,
    "married_since" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_donations" (
    "id" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "enabled_at" TIMESTAMP(3) NOT NULL,
    "tier" INTEGER NOT NULL DEFAULT 1,
    "expired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_config" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT E'pt-BR',

    CONSTRAINT "user_config_pkey" PRIMARY KEY ("id")
);

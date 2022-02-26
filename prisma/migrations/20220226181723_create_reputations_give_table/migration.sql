/*
  Warnings:

  - The primary key for the `dailies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receivedAt` on the `dailies` table. All the data in the column will be lost.
  - You are about to drop the column `receivedById` on the `dailies` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `dailies` table. All the data in the column will be lost.
  - The primary key for the `premium_keys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activeIn` on the `premium_keys` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `premium_keys` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `premium_keys` table. All the data in the column will be lost.
  - The primary key for the `reminders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `channelId` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `remindAt` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reminders` table. All the data in the column will be lost.
  - Added the required column `received_at` to the `dailies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `received_by` to the `dailies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `dailies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active_in` to the `premium_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `premium_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `premium_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_id` to the `reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remind_at` to the `reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dailies" DROP CONSTRAINT "dailies_pkey",
DROP COLUMN "receivedAt",
DROP COLUMN "receivedById",
DROP COLUMN "userAgent",
ADD COLUMN     "received_at" VARCHAR(255) NOT NULL,
ADD COLUMN     "received_by" VARCHAR(255) NOT NULL,
ADD COLUMN     "user_agent" VARCHAR(255) NOT NULL,
ALTER COLUMN "ip" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ADD CONSTRAINT "dailies_pkey" PRIMARY KEY ("received_by");

-- AlterTable
ALTER TABLE "premium_keys" DROP CONSTRAINT "premium_keys_pkey",
DROP COLUMN "activeIn",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "active_in" TEXT NOT NULL,
ADD COLUMN     "expires_at" VARCHAR(255) NOT NULL,
ADD COLUMN     "user" TEXT NOT NULL,
ADD CONSTRAINT "premium_keys_pkey" PRIMARY KEY ("user");

-- AlterTable
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_pkey",
DROP COLUMN "channelId",
DROP COLUMN "remindAt",
DROP COLUMN "userId",
ADD COLUMN     "channel_id" VARCHAR(255) NOT NULL,
ADD COLUMN     "remind_at" VARCHAR(255) NOT NULL,
ADD COLUMN     "user_id" VARCHAR(255) NOT NULL,
ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "reputations" (
    "given_by" VARCHAR(255) NOT NULL,
    "given_by_ip" TEXT NOT NULL,
    "given_by_email" TEXT NOT NULL,
    "received_by" VARCHAR(255) NOT NULL,
    "received_at" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "reputations_pkey" PRIMARY KEY ("given_by")
);

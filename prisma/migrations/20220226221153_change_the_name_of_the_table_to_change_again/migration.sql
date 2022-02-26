/*
  Warnings:

  - You are about to drop the `reminders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "reminders";

-- CreateTable
CREATE TABLE "pending_reminders" (
    "user" VARCHAR(255) NOT NULL,
    "channel_id" VARCHAR(255) NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "pending_reminders_pkey" PRIMARY KEY ("user")
);

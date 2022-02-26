/*
  Warnings:

  - You are about to drop the `pending_reminders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pending_reminders";

-- CreateTable
CREATE TABLE "reminders" (
    "user" VARCHAR(255) NOT NULL,
    "channel_id" VARCHAR(255) NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("user")
);

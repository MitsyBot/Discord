-- CreateTable
CREATE TABLE "reminders" (
    "userId" VARCHAR(255) NOT NULL,
    "channelId" VARCHAR(255) NOT NULL,
    "remindAt" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("userId")
);

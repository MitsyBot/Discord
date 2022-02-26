-- CreateTable
CREATE TABLE "client" (
    "id" VARCHAR(255) NOT NULL DEFAULT E'790760362060283974',
    "userBlocklist" TEXT[],
    "guildBlocklist" TEXT[],

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

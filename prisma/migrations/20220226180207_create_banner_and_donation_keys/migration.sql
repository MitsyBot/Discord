-- CreateTable
CREATE TABLE "banner" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationKeys" (
    "activeIn" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expiresAt" VARCHAR(255) NOT NULL,
    "metadata" VARCHAR(255) NOT NULL,

    CONSTRAINT "DonationKeys_pkey" PRIMARY KEY ("userId")
);

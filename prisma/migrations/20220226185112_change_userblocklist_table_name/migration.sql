/*
  Warnings:

  - You are about to drop the column `guildBlocklist` on the `mitsy_client` table. All the data in the column will be lost.
  - You are about to drop the column `userBlocklist` on the `mitsy_client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mitsy_client" DROP COLUMN "guildBlocklist",
DROP COLUMN "userBlocklist",
ADD COLUMN     "guild_blocklist" TEXT[],
ADD COLUMN     "user_blocklist" TEXT[];

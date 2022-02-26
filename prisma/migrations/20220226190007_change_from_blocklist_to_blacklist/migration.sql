/*
  Warnings:

  - You are about to drop the column `guild_blocklist` on the `mitsy_client` table. All the data in the column will be lost.
  - You are about to drop the column `user_blocklist` on the `mitsy_client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mitsy_client" DROP COLUMN "guild_blocklist",
DROP COLUMN "user_blocklist",
ADD COLUMN     "guild_blacklist" TEXT[],
ADD COLUMN     "user_blacklist" TEXT[];

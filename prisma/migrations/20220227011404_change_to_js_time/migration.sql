/*
  Warnings:

  - The `last_daily` column on the `user_cooldowns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_rep` column on the `user_cooldowns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `expires_at` on the `banned_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "banned_users" DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user_cooldowns" DROP COLUMN "last_daily",
ADD COLUMN     "last_daily" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "last_rep",
ADD COLUMN     "last_rep" DOUBLE PRECISION NOT NULL DEFAULT 0;

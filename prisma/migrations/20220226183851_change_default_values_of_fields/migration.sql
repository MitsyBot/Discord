/*
  Warnings:

  - You are about to alter the column `cost` on the `Colors` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `rarity` column on the `banner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `id` on the `fanarts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Changed the type of `price` on the `banner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Colors" ALTER COLUMN "cost" SET DEFAULT 0,
ALTER COLUMN "cost" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "banner" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
DROP COLUMN "rarity",
ADD COLUMN     "rarity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "fanarts" ALTER COLUMN "id" SET DEFAULT 0,
ALTER COLUMN "id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "premium_keys" ADD COLUMN     "tier" INTEGER NOT NULL DEFAULT 1;

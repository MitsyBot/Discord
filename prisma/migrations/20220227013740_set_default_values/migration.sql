/*
  Warnings:

  - The `married_since` column on the `user_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_profile" ALTER COLUMN "comets" SET DEFAULT 0,
ALTER COLUMN "global_xp" SET DEFAULT 0,
ALTER COLUMN "global_level" SET DEFAULT 90,
ALTER COLUMN "aboutme" SET DEFAULT E'Mitsy é a minha melhor amiga, você pode mudar isto no seu perfil do meu website!',
ALTER COLUMN "total_reps" SET DEFAULT 0,
ALTER COLUMN "active_background" SET DEFAULT E'mitsy_1',
ALTER COLUMN "active_profile_design" SET DEFAULT E'default',
ALTER COLUMN "color" SET DEFAULT E'#f895fb',
ALTER COLUMN "afkReason" SET DEFAULT E'',
ALTER COLUMN "married_user" SET DEFAULT E'',
DROP COLUMN "married_since",
ADD COLUMN     "married_since" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "gender" SET DEFAULT E'UNKNOWN';

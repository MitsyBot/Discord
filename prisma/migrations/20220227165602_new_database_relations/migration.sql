-- DropForeignKey
ALTER TABLE "user_config" DROP CONSTRAINT "user_config_id_fkey";

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_id_fkey" FOREIGN KEY ("id") REFERENCES "user_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cooldowns" ADD CONSTRAINT "user_cooldowns_id_fkey" FOREIGN KEY ("id") REFERENCES "user_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

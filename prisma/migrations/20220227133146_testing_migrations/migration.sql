-- AlterTable
ALTER TABLE "guild_general" ALTER COLUMN "blacklisted_warning" SET DEFAULT E'Este canal esta bloqueado de usar meus comandos!';

-- AddForeignKey
ALTER TABLE "user_config" ADD CONSTRAINT "user_config_id_fkey" FOREIGN KEY ("id") REFERENCES "user_cooldowns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

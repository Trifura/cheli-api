-- DropForeignKey
ALTER TABLE `user_challenges` DROP FOREIGN KEY `user_challenges_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_challenges_likes` DROP FOREIGN KEY `user_challenges_likes_user_id_fkey`;

-- AlterTable
ALTER TABLE `user_challenges` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_challenges_likes` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `user_challenges` ADD CONSTRAINT `user_challenges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenges_likes` ADD CONSTRAINT `user_challenges_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

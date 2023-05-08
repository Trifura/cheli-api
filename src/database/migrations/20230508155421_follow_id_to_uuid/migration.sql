/*
  Warnings:

  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_follower_id_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_following_id_fkey`;

-- AlterTable
ALTER TABLE `follows` DROP PRIMARY KEY,
    MODIFY `follower_id` VARCHAR(191) NOT NULL,
    MODIFY `following_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`follower_id`, `following_id`);

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

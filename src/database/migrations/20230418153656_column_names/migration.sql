/*
  Warnings:

  - You are about to drop the column `challengeId` on the `user_challenges` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_challenges` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_challenges` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_challenges` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_challenges_likes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_challenges_likes` table. All the data in the column will be lost.
  - You are about to drop the column `userChallengeId` on the `user_challenges_likes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_challenges_likes` table. All the data in the column will be lost.
  - Added the required column `challenge_id` to the `user_challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_challenges_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_challenge_id` to the `user_challenges_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_challenges_likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_challenges` DROP FOREIGN KEY `user_challenges_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `user_challenges` DROP FOREIGN KEY `user_challenges_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_challenges_likes` DROP FOREIGN KEY `user_challenges_likes_userChallengeId_fkey`;

-- DropForeignKey
ALTER TABLE `user_challenges_likes` DROP FOREIGN KEY `user_challenges_likes_userId_fkey`;

-- AlterTable
ALTER TABLE `user_challenges` DROP COLUMN `challengeId`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `userId`,
    ADD COLUMN `challenge_id` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_challenges_likes` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `userChallengeId`,
    DROP COLUMN `userId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `user_challenge_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user_challenges` ADD CONSTRAINT `user_challenges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenges` ADD CONSTRAINT `user_challenges_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenges_likes` ADD CONSTRAINT `user_challenges_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenges_likes` ADD CONSTRAINT `user_challenges_likes_user_challenge_id_fkey` FOREIGN KEY (`user_challenge_id`) REFERENCES `user_challenges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

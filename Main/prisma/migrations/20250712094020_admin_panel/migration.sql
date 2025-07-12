/*
  Warnings:

  - You are about to drop the `itemcondition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `swapstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactiontype` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` VARCHAR(191) NULL,
    ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rejectionReason` TEXT NULL,
    MODIFY `status` ENUM('PENDING_APPROVAL', 'AVAILABLE', 'PENDING', 'SWAPPED', 'REJECTED', 'REMOVED') NOT NULL DEFAULT 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isBanned` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `itemcondition`;

-- DropTable
DROP TABLE `itemstatus`;

-- DropTable
DROP TABLE `swapstatus`;

-- DropTable
DROP TABLE `transactiontype`;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR') NOT NULL DEFAULT 'MODERATOR',
    `permissions` JSON NOT NULL,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_adminId_key`(`adminId`),
    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_reviews` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `action` ENUM('APPROVE', 'REJECT', 'REMOVE', 'FLAG') NOT NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_actions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `action` ENUM('WARN', 'SUSPEND', 'BAN', 'UNBAN', 'DELETE_ACCOUNT') NOT NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `item_reviews` ADD CONSTRAINT `item_reviews_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_reviews` ADD CONSTRAINT `item_reviews_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_actions` ADD CONSTRAINT `user_actions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_actions` ADD CONSTRAINT `user_actions_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

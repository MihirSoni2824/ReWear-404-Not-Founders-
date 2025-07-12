-- CreateEnum
CREATE TABLE `ItemCondition` (
    `EXCELLENT` ENUM('EXCELLENT') NOT NULL,
    `GOOD` ENUM('GOOD') NOT NULL,
    `FAIR` ENUM('FAIR') NOT NULL,
    `POOR` ENUM('POOR') NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateEnum
CREATE TABLE `ItemStatus` (
    `AVAILABLE` ENUM('AVAILABLE') NOT NULL,
    `PENDING` ENUM('PENDING') NOT NULL,
    `SWAPPED` ENUM('SWAPPED') NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateEnum
CREATE TABLE `SwapStatus` (
    `PENDING` ENUM('PENDING') NOT NULL,
    `ACCEPTED` ENUM('ACCEPTED') NOT NULL,
    `REJECTED` ENUM('REJECTED') NOT NULL,
    `COMPLETED` ENUM('COMPLETED') NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateEnum
CREATE TABLE `TransactionType` (
    `EARN` ENUM('EARN') NOT NULL,
    `SPEND` ENUM('SPEND') NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 100,
    `profilePic` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `images` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR') NOT NULL,
    `status` ENUM('AVAILABLE', 'PENDING', 'SWAPPED') NOT NULL DEFAULT 'AVAILABLE',
    `points` INTEGER NOT NULL,
    `tags` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swaps` (
    `id` VARCHAR(191) NOT NULL,
    `itemId1` VARCHAR(191) NOT NULL,
    `itemId2` VARCHAR(191) NOT NULL,
    `userId1` VARCHAR(191) NOT NULL,
    `userId2` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `points_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `type` ENUM('EARN', 'SPEND') NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `swaps` ADD CONSTRAINT `swaps_itemId1_fkey` FOREIGN KEY (`itemId1`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `swaps` ADD CONSTRAINT `swaps_itemId2_fkey` FOREIGN KEY (`itemId2`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `swaps` ADD CONSTRAINT `swaps_userId1_fkey` FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `swaps` ADD CONSTRAINT `swaps_userId2_fkey` FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_transactions` ADD CONSTRAINT `points_transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE; 
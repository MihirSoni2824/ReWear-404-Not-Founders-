-- ReWear Database Tables Creation Script
-- Run this in MySQL Workbench to create all necessary tables

USE rewear_db;

-- Create users table
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
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_key` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create items table
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
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create swaps table
CREATE TABLE `swaps` (
    `id` VARCHAR(191) NOT NULL,
    `itemId1` VARCHAR(191) NOT NULL,
    `itemId2` VARCHAR(191) NOT NULL,
    `userId1` VARCHAR(191) NOT NULL,
    `userId2` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`itemId1`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`itemId2`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create points_transactions table
CREATE TABLE `points_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `type` ENUM('EARN', 'SPEND') NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data for Jane Doe
INSERT INTO `users` (`id`, `email`, `password`, `name`, `location`, `points`, `profilePic`, `bio`, `createdAt`, `updatedAt`) VALUES
('user-1', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO', 'Jane Doe', 'New York, USA', 1200, '/DesignImages/UserDashBoardPage6.png', 'Fashion enthusiast and sustainability advocate', NOW(), NOW());

-- Insert sample items
INSERT INTO `items` (`id`, `userId`, `title`, `description`, `images`, `category`, `size`, `condition`, `status`, `points`, `tags`, `createdAt`, `updatedAt`) VALUES
('item-1', 'user-1', 'Vintage Denim Jacket', 'A classic denim jacket from the 90s. This jacket is in excellent condition and has a unique vintage look.', '["/DesignImages/ProductDetailPage7.png"]', 'Outerwear', 'M', 'EXCELLENT', 'AVAILABLE', 500, '["vintage", "denim", "jacket"]', NOW(), NOW()),
('item-2', 'user-1', 'Bohemian Maxi Dress', 'A beautiful and flowy maxi dress perfect for summer.', '["/DesignImages/ItemListingPage5.png"]', 'Dresses', 'S', 'GOOD', 'AVAILABLE', 300, '["bohemian", "maxi", "dress"]', NOW(), NOW());

-- Insert sample points transactions
INSERT INTO `points_transactions` (`id`, `userId`, `amount`, `type`, `reason`, `createdAt`) VALUES
('tx-1', 'user-1', 100, 'EARN', 'Account creation bonus', NOW()),
('tx-2', 'user-1', 50, 'EARN', 'Item upload bonus', NOW()),
('tx-3', 'user-1', 50, 'EARN', 'Item upload bonus', NOW()),
('tx-4', 'user-1', 1000, 'EARN', 'Community contribution bonus', NOW());

SELECT 'Database tables created successfully!' as message; 
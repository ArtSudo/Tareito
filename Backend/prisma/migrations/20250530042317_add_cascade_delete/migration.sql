-- DropForeignKey
ALTER TABLE `inboxitem` DROP FOREIGN KEY `InboxItem_userId_fkey`;

-- DropIndex
DROP INDEX `InboxItem_userId_fkey` ON `inboxitem`;

-- AddForeignKey
ALTER TABLE `InboxItem` ADD CONSTRAINT `InboxItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

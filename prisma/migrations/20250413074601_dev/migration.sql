-- AlterTable
ALTER TABLE `NbkFile` ADD COLUMN `contentType` ENUM('TABLE', 'MINDMAP', 'MARKDOWN', 'PLAIN_TEXT') NULL;

-- CreateTable
CREATE TABLE `NbkTable` (
    `id` VARCHAR(191) NOT NULL,
    `fileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NbkTable_fileId_key`(`fileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NbkTableColumn` (
    `id` VARCHAR(191) NOT NULL,
    `tableId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'DATETIME', 'TEXT', 'JSON') NOT NULL,
    `description` VARCHAR(191) NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NbkTableColumn_tableId_name_key`(`tableId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NbkTable` ADD CONSTRAINT `NbkTable_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `NbkFile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NbkTableColumn` ADD CONSTRAINT `NbkTableColumn_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `NbkTable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

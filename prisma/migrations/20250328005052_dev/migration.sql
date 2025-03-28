/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `SysUser` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SysUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SysUser` DROP COLUMN `deletedAt`,
    DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `NbkFile` (
    `id` VARCHAR(191) NOT NULL,
    `pid` VARCHAR(191) NOT NULL DEFAULT '0',
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

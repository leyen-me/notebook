/*
  Warnings:

  - Added the required column `type` to the `NbkFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NbkFile` ADD COLUMN `type` ENUM('FOLDER', 'FILE') NOT NULL;

/*
  Warnings:

  - The values [PLAIN_TEXT] on the enum `NbkFile_contentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `NbkFile` MODIFY `contentType` ENUM('TABLE', 'MINDMAP', 'MARKDOWN') NULL;

/*
  Warnings:

  - Added the required column `publicationDate` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `publicationDate` DATETIME(3) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `deliveryCity` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCountry` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryPostalCode` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryState` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryStreet` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `_producttopromotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_producttotag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subCategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_producttopromotion` DROP FOREIGN KEY `_ProductToPromotion_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttopromotion` DROP FOREIGN KEY `_ProductToPromotion_B_fkey`;

-- DropForeignKey
ALTER TABLE `_producttotag` DROP FOREIGN KEY `_ProductToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttotag` DROP FOREIGN KEY `_ProductToTag_B_fkey`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `deliveryCity`,
    DROP COLUMN `deliveryCountry`,
    DROP COLUMN `deliveryPostalCode`,
    DROP COLUMN `deliveryState`,
    DROP COLUMN `deliveryStreet`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `subCategoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_producttopromotion`;

-- DropTable
DROP TABLE `_producttotag`;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SubCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPromotion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `promotionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_promotionId_fkey` FOREIGN KEY (`promotionId`) REFERENCES `Promotion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTag` ADD CONSTRAINT `ProductTag_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTag` ADD CONSTRAINT `ProductTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

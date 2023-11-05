-- DropForeignKey
ALTER TABLE `Warehouse` DROP FOREIGN KEY `Warehouse_defaultContainerId_fkey`;

-- AlterTable
ALTER TABLE `Warehouse` MODIFY `defaultContainerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_defaultContainerId_fkey` FOREIGN KEY (`defaultContainerId`) REFERENCES `Container`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

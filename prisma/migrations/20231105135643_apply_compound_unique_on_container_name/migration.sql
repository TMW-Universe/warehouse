/*
  Warnings:

  - A unique constraint covering the columns `[name,warehouseId]` on the table `Container` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Container_name_key` ON `Container`;

-- CreateIndex
CREATE UNIQUE INDEX `Container_name_warehouseId_key` ON `Container`(`name`, `warehouseId`);

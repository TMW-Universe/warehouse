import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';
import { FilesystemService } from 'src/warehouse/filesystem/filesystem.service';
import { PrismaClient } from '@prisma/client';
import { FileRepository } from 'src/database/repository/file.repository';
import { FileBlobRepository } from 'src/database/repository/file-blob.repository';
import { ContainerRepository } from 'src/database/repository/container.repository';

@Module({
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    WarehouseRepository,
    FileRepository,
    FileBlobRepository,
    ContainerRepository,
    KeysService,
    FilesystemService,
    PrismaClient,
  ],
})
export class WarehouseModule {}

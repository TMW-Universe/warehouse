import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';
import { FilesystemService } from 'src/warehouse/filesystem/filesystem.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    WarehouseRepository,
    KeysService,
    FilesystemService,
    PrismaClient,
  ],
})
export class WarehouseModule {}

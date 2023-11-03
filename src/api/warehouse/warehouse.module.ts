import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository, KeysService],
})
export class WarehouseModule {}

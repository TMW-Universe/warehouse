import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository],
})
export class WarehouseModule {}

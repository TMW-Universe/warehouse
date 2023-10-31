import { Module } from '@nestjs/common';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { PrismaModule } from './database/client/prisma.module';

@Module({
  imports: [PrismaModule, WarehouseModule],
})
export class AppModule {}

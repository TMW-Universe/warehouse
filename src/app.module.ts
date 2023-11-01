import { Module } from '@nestjs/common';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { PrismaModule } from './database/client/prisma.module';
import { WarehouseSettingsModule } from './warehouse/settings/modules/warehouse-settings.module';

@Module({
  imports: [PrismaModule, WarehouseSettingsModule, WarehouseModule],
})
export class AppModule {}

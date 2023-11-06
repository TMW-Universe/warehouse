import { Inject, Logger, Module } from '@nestjs/common';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { PrismaModule } from './database/client/prisma.module';
import {
  WAREHOUSE_SETTINGS_PROVIDER,
  WarehouseSettingsModule,
} from './warehouse/settings/modules/warehouse-settings.module';
import { ApiKeysModule } from 'nestjs-api-keys';
import { readFileSync } from 'fs';
import { ApiPermissions } from './utils/types/permissions/api-permissions.enum';
import { readGlobalWarehouseSettings } from './warehouse/settings/utils/read-global-warehouse-settings.util';
import { readWarehouseSettings } from './warehouse/settings/utils/read-warehouse-settings.util';
import { KeysModule } from './api/keys/keys.module';
import { RsaModule } from './warehouse/rsa/rsa.module';
import { SetupModule } from './api/setup/setup.module';

@Module({
  imports: [
    ApiKeysModule.registerAsync(async () => {
      // Read global settings file
      const { warehouses } = readGlobalWarehouseSettings();

      return {
        apiKeys: warehouses.map(({ name }) => {
          // Read warehouse settings file
          const { apiKeys: keys } = readWarehouseSettings(name);

          Logger.log(
            `Loaded '${name}' warehouse API key settings`,
            'Warehouse settings',
          );

          return {
            name,
            keys,
            permissions: [ApiPermissions.READ_FILE, ApiPermissions.UPLOAD_FILE],
          };
        }),
      };
    }),
    PrismaModule,
    WarehouseSettingsModule.register(),
    RsaModule,
    WarehouseModule,
    KeysModule,
    SetupModule,
  ],
})
export class AppModule {}

import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { readGlobalWarehouseSettings } from '../utils/read-global-warehouse-settings.util';
import { readWarehouseKey } from '../utils/read-warehouse-key.util';
import { readWarehouseSettings } from '../utils/read-warehouse-settings.util';

export const WAREHOUSE_SETTINGS_PROVIDER = 'WAREHOUSE_SETTINGS_PROVIDER';

@Global()
@Module({})
export class WarehouseSettingsModule {
  static register(): DynamicModule {
    const { warehouses } = readGlobalWarehouseSettings();

    return {
      module: WarehouseSettingsModule,
      providers: [
        {
          provide: WAREHOUSE_SETTINGS_PROVIDER,
          useValue: warehouses.map(({ name }) => {
            const { apiKeys } = readWarehouseSettings(name);

            const publicKey = readWarehouseKey(name, 'public');
            const privateKey = readWarehouseKey(name, 'private');

            Logger.log(`Loaded '${name}'`, 'Warehouse keys');

            // Store PUB and PRIV keys along with their API keys
            return {
              warehouse: name,
              apiKeys,
              publicKey,
              privateKey,
            };
          }),
        },
      ],
    };
  }
}

import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { readGlobalWarehouseSettings } from '../utils/read-global-warehouse-settings.util';
import { readWarehouseKey } from '../utils/read-warehouse-key.util';
import { readWarehouseSettings } from '../utils/read-warehouse-settings.util';
import { existsSync, writeFileSync } from 'fs';
import { getEnv } from 'src/utils/config/get-env';
import { FilesystemType } from 'src/types/warehouse/filesystem/filesystem-type.enum';

const NodeRSA = require('node-rsa');

export const WAREHOUSE_SETTINGS_PROVIDER = 'WAREHOUSE_SETTINGS_PROVIDER';

export type WarehouseSettingsProvider = {
  warehouse: string;
  apiKeys: string[];
  publicKey: string;
  privateKey: string;
  filesystemType: FilesystemType;
  path: string;
}[];

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
            const { apiKeys, path, filesystemType } =
              readWarehouseSettings(name);

            // Check if keys exist
            if (
              !existsSync(`/config/${name}/public.key`) &&
              !existsSync(`/config/${name}/private.key`)
            ) {
              const rsaBytes = getEnv().rsaKeyBytes;

              // Minimum 2048 bytes
              const key = new NodeRSA({ b: rsaBytes < 2048 ? 2048 : rsaBytes });

              const publicKey = key.exportKey('public');
              const privateKey = key.exportKey('private');

              writeFileSync(`/config/${name}/public.key`, publicKey);
              writeFileSync(`/config/${name}/private.key`, privateKey);

              Logger.log(
                `Created public and private keys for '${name}' warehouse.`,
              );
            }

            const publicKey = readWarehouseKey(name, 'public');
            const privateKey = readWarehouseKey(name, 'private');

            Logger.log(`Loaded '${name}'`, 'Warehouse keys');

            // Store PUB and PRIV keys along with their API keys
            return {
              warehouse: name,
              apiKeys,
              publicKey,
              privateKey,
              filesystemType: filesystemType ?? FilesystemType.LOCAL,
              path,
            };
          }) as WarehouseSettingsProvider,
        },
      ],
      exports: [WAREHOUSE_SETTINGS_PROVIDER],
    };
  }
}

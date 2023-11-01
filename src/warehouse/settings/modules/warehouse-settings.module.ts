import { Logger, Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ApiKeysModule } from 'nestjs-api-keys';
import { ApiPermissions } from 'src/utils/types/permissions/api-permissions.enum';

@Module({
  imports: [
    ApiKeysModule.registerAsync(async () => {
      // Read global settings file
      const { warehouses } = JSON.parse(
        readFileSync('/config/settings.json', 'utf-8'),
      ) as { warehouses: { name: string }[] };

      return {
        apiKeys: warehouses.map(({ name }) => {
          // Read warehouse settings file
          const { apiKeys: keys } = JSON.parse(
            readFileSync(`/config/${name}/settings.json`, 'utf-8'),
          ) as { apiKeys: string[] };

          Logger.log(
            `Loaded '${name}' warehouse settings`,
            'Warehouse settings',
          );

          return {
            name,
            keys,
            permissions: [ApiPermissions.READ_FILE],
          };
        }),
      };
    }),
  ],
})
export class WarehouseSettingsModule {}

import { Inject, Injectable } from '@nestjs/common';
import {
  WAREHOUSE_SETTINGS_PROVIDER,
  WarehouseSettingsProvider,
} from 'src/warehouse/settings/modules/warehouse-settings.module';

@Injectable()
export class KeysService {
  constructor(
    @Inject(WAREHOUSE_SETTINGS_PROVIDER)
    private readonly warehouseSettings: WarehouseSettingsProvider,
  ) {}

  async getPublicKeyByApiKey(apiKey: string) {
    return this.warehouseSettings.find((wsp) => wsp.apiKeys.includes(apiKey))
      .publicKey;
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RsaService } from 'src/warehouse/rsa/rsa.service';
import {
  WAREHOUSE_SETTINGS_PROVIDER,
  WarehouseSettingsProvider,
} from 'src/warehouse/settings/modules/warehouse-settings.module';

@Injectable()
export class KeysService {
  constructor(
    private readonly rsaService: RsaService,
    @Inject(WAREHOUSE_SETTINGS_PROVIDER)
    private readonly warehouseSettings: WarehouseSettingsProvider,
  ) {}

  async getConfigByApiKey(apiKey: string) {
    return this.warehouseSettings.find((wsp) => wsp.apiKeys.includes(apiKey));
  }

  async getPublicKeyByApiKey(apiKey: string) {
    return (await this.getConfigByApiKey(apiKey)).publicKey;
  }

  async verifySignature(apiKey: string, message: string) {
    try {
      const { privateKey } = await this.getConfigByApiKey(apiKey);

      const decrypted = this.rsaService.decryptWithPrivateKey(
        privateKey,
        message,
      );

      if (!decrypted) throw new BadRequestException();
    } catch (e) {
      throw new BadRequestException();
    }
  }
}

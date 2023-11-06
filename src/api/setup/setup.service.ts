import { Injectable } from '@nestjs/common';
import { KeysService } from '../keys/keys.service';

@Injectable()
export class SetupService {
  constructor(private readonly keysService: KeysService) {}

  async getSetupInformation(apiKey: string) {
    return {
      publicKey: await this.keysService.getPublicKeyByApiKey(apiKey),
      warehouseName: (await this.keysService.getConfigByApiKey(apiKey))
        .warehouse,
    };
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { addMinutes, isFuture } from 'date-fns';
import { SignDTO } from 'src/dtos/keys/sign.body';
import { AccessToken } from 'src/types/token/access-token.type';
import { SignedToken } from 'src/types/token/signed-token.type';
import { randomString } from 'src/utils/string/random-string.util';
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

  async verifySignature(apiKey: string, token: string) {
    try {
      const { privateKey } = await this.getConfigByApiKey(apiKey);

      // Convert from Base64 to string
      const base64Data = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));
      const decodedToken = new TextDecoder().decode(base64Data);

      const decrypted = this.rsaService.decryptWithPrivateKey(
        privateKey,
        (JSON.parse(decodedToken) as AccessToken).st,
      );

      if (!decrypted) throw new BadRequestException();

      return decrypted;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async signAccessToken(
    apiKey: string,
    { fileId, expiresAt: definedExpiresAt }: SignDTO,
  ) {
    const { warehouse, publicKey } = await this.getConfigByApiKey(apiKey);

    if (definedExpiresAt && !isFuture(definedExpiresAt))
      throw new Error('expiresAt must be a future time');

    const expiresAt = definedExpiresAt ?? addMinutes(new Date(Date.now()), 30);

    const signedToken = JSON.stringify({
      w: warehouse,
      st: this.rsaService.encryptWithPublicKey(
        publicKey,
        JSON.stringify({
          expiresAt,
          fileId,
          salt: randomString(24),
        } as SignedToken),
      ),
    } as AccessToken);

    // Convert to Base64
    const encoder = new TextEncoder();
    const data = encoder.encode(signedToken);

    return Buffer.from(data).toString('base64');
  }

  async decodeAccessToken(token: string) {
    // Convert from Base64 to string
    const base64Data = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));
    const decodedToken = new TextDecoder().decode(base64Data);
    const { w, st }: AccessToken = JSON.parse(decodedToken);

    const { privateKey } = this.warehouseSettings.find(
      (ws) => ws.warehouse === w,
    );

    return {
      warehouseName: w,
      ...(JSON.parse(
        this.rsaService.decryptWithPrivateKey(privateKey, st),
      ) as SignedToken),
    };
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard, HeaderApiKey } from 'nestjs-api-keys';
import { KeysService } from './keys.service';

@UseGuards(ApiKeyGuard({}))
@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get('key')
  async getKey(@HeaderApiKey() apiKey: string) {
    return await this.keysService.getPublicKeyByApiKey(apiKey);
  }

  @Get('verify')
  async verify() {
    return true;
  }
}

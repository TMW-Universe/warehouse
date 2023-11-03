import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard, HeaderApiKey } from 'nestjs-api-keys';
import { KeysService } from './keys.service';
import { VerifyKeyDTO } from 'src/dtos/keys/verify-key.dto';

@UseGuards(ApiKeyGuard({}))
@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get('key')
  async getKey(@HeaderApiKey() apiKey: string) {
    return await this.keysService.getPublicKeyByApiKey(apiKey);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verify(
    @HeaderApiKey() apiKey: string,
    @Body() { message }: VerifyKeyDTO,
  ) {
    return this.keysService.verifySignature(apiKey, message);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { SetupService } from './setup.service';
import { ApiKeyGuard, HeaderApiKey } from 'nestjs-api-keys';

@UseGuards(ApiKeyGuard({}))
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get('info')
  async getSetupInformation(@HeaderApiKey() apiKey: string) {
    return await this.setupService.getSetupInformation(apiKey);
  }
}

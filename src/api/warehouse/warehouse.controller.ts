import { Controller, Get, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { AccessToken } from 'src/decorators/access-token.decorator';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('file')
  async getFileById(@AccessToken() token: string) {}

  @Get('file/metadata')
  async getFileMetadataById(@AccessToken() token: string) {
    return await this.warehouseService.getFileMetadataByToken(token);
  }
}

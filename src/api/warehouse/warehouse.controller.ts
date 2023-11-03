import { Controller, Get, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ApiKeyGuard } from 'nestjs-api-keys';
import { ApiPermissions } from 'src/utils/types/permissions/api-permissions.enum';
import { AccessToken } from 'src/decorators/access-token.decorator';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @UseGuards(ApiKeyGuard({ permissions: [ApiPermissions.READ_FILE] }))
  @Get('file')
  async getFileById(@AccessToken() token: string) {
    return await this.warehouseService.getFileMetadataById('0');
  }
}

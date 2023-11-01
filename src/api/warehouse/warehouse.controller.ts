import { Controller, Get, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ApiKeyGuard } from 'nestjs-api-keys';
import { ApiPermissions } from 'src/utils/types/permissions/api-permissions.enum';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @UseGuards(ApiKeyGuard({ permissions: [ApiPermissions.READ_FILE] }))
  @Get(':name/file')
  async getFileById() {
    return await this.warehouseService.getFileMetadataById('0');
  }
}

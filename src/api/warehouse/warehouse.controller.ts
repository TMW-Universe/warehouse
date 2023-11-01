import { Controller, Get } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get(':name/image')
  async getImageById() {
    return await this.warehouseService.getFileMetadataById('0');
  }
}

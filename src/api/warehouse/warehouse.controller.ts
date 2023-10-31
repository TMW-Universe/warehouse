import { Controller, Get } from '@nestjs/common';

@Controller('warehouse')
export class WarehouseController {
  @Get(':name/image')
  async getImageById() {}
}

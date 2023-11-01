import { Injectable } from '@nestjs/common';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async getFileMetadataById(fileId: string) {
    return await this.warehouseRepository.findFileMetadataById(fileId);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    private readonly keysService: KeysService,
  ) {}

  async getFileMetadataById(fileId: string) {
    return await this.warehouseRepository.findFileMetadataById(fileId);
  }

  async getFileMetadataByToken(token: string) {
    const { warehouseName, fileId } =
      await this.keysService.decodeAccessToken(token);
    const fileMetadata =
      await this.warehouseRepository.findFileMetadataByWarehouseNameAndId(
        warehouseName,
        fileId,
      );

    if (!fileMetadata) throw new NotFoundException();

    const { File, ...metadata } = fileMetadata;

    return metadata;
  }
}

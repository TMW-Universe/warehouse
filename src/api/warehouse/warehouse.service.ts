import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';
import { FilesystemService } from 'src/warehouse/filesystem/filesystem.service';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    private readonly keysService: KeysService,
    private readonly filesystemService: FilesystemService,
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

  async uploadFileByApiKey(apiKey: string, file: Express.Multer.File) {
    const { warehouse } = await this.keysService.getConfigByApiKey(apiKey);

    return await this.filesystemService.uploadFile(file, warehouse);
  }

  async streamFileByToken(token: string) {
    const { warehouseName, fileId } =
      await this.keysService.decodeAccessToken(token);

    const fileBuffer = await this.filesystemService.downloadFile(
      fileId,
      warehouseName,
    );

    return new StreamableFile(fileBuffer);
  }
}

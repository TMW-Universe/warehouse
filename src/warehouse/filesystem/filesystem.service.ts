import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesystemType } from 'src/types/warehouse/filesystem/filesystem-type.enum';
import { LocalFilesystem } from './local/local.filesystem';
import { IFilesystem } from 'src/types/warehouse/filesystem/filesystem.interface';
import { UploadFileOptions } from 'src/types/warehouse/filesystem/upload-file-options.type';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { Container } from '@prisma/client';
import {
  WAREHOUSE_SETTINGS_PROVIDER,
  WarehouseSettingsProvider,
} from '../settings/modules/warehouse-settings.module';

@Injectable()
export class FilesystemService {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    @Inject(WAREHOUSE_SETTINGS_PROVIDER)
    private readonly warehouseSettings: WarehouseSettingsProvider,
  ) {}

  private pick = (fsType: FilesystemType): IFilesystem => {
    switch (fsType) {
      case FilesystemType.LOCAL:
        return new LocalFilesystem();
    }
  };

  private getContainer = async (
    warehouseName: string,
    containerName?: string,
  ) => {
    let container: Container;

    // If there is a explicit container
    if (containerName)
      container =
        await this.warehouseRepository.findContainerByNameAndWarehouseName(
          containerName,
          warehouseName,
        );
    // If there is no explicit container
    else {
      const warehouse =
        await this.warehouseRepository.findWarehouseByName(warehouseName);
      if (warehouse.defaultContainerId)
        container = await this.warehouseRepository.findContainerById(
          warehouse.defaultContainerId,
        );
      // If there isn't default container defined
      else
        container =
          await this.warehouseRepository.findFirstContainerByWarehouseId(
            warehouse.id,
          );
    }

    // Check if container was found
    if (!container) throw new InternalServerErrorException();

    return container;
  };

  public uploadFile = async (
    file: Express.Multer.File,
    warehouseName: string,
    options?: UploadFileOptions,
  ) => {
    const settingsContainer = this.warehouseSettings.find(
      (ws) => ws.warehouse === warehouseName,
    );

    if (!settingsContainer) throw new InternalServerErrorException();

    const container = await this.getContainer(
      warehouseName,
      options?.containerName,
    );

    await this.pick(settingsContainer.filesystemType).uploadFile(
      file.filename,
      file.buffer,
      settingsContainer.path,
    );
  };
}

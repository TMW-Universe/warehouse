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
import { Container, File, FileBlob, PrismaClient } from '@prisma/client';
import {
  WAREHOUSE_SETTINGS_PROVIDER,
  WarehouseSettingsProvider,
} from '../settings/modules/warehouse-settings.module';
import { DownloadFileOptions } from 'src/types/warehouse/filesystem/download-file-options.type';
import { FileRepository } from 'src/database/repository/file.repository';
import { FileBlobRepository } from 'src/database/repository/file-blob.repository';
import { ContainerRepository } from 'src/database/repository/container.repository';

@Injectable()
export class FilesystemService {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    private readonly fileRepository: FileRepository,
    private readonly fileBlobRepository: FileBlobRepository,
    private readonly containerRepository: ContainerRepository,
    @Inject(WAREHOUSE_SETTINGS_PROVIDER)
    private readonly warehouseSettings: WarehouseSettingsProvider,
    private readonly prisma: PrismaClient,
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
        await this.containerRepository.findContainerByNameAndWarehouseName(
          containerName,
          warehouseName,
        );
    // If there is no explicit container
    else {
      const warehouse =
        await this.warehouseRepository.findWarehouseByName(warehouseName);
      if (warehouse.defaultContainerId)
        container = await this.containerRepository.findContainerById(
          warehouse.defaultContainerId,
        );
      // If there isn't default container defined
      else
        container =
          await this.containerRepository.findFirstContainerByWarehouseId(
            warehouse.id,
          );
    }

    // Check if container was found
    if (!container) throw new InternalServerErrorException();

    return container;
  };

  private extractFileMetadata = (file: Express.Multer.File) => {
    console.log(file);
    const hasExtension = file.originalname.includes('.');
    const splitName = file.originalname.split('.');
    const extension = hasExtension ? splitName[splitName.length - 1] : null;

    return {
      name: hasExtension
        ? splitName.filter((_, i) => i !== extension.length - 1).join('.')
        : file.originalname,
      extension,
      size: file.size,
    } satisfies Omit<FileBlob, 'createdAt' | 'updatedAt' | 'id' | 'fileId'>;
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

    const fileMetadata = this.extractFileMetadata(file);

    return await this.prisma.$transaction(async (t) => {
      // Create file in the container
      const { id: fileId } = await this.fileRepository.createFile(
        {
          containerId: container.id,
        },
        { transaction: t },
      );

      // Create blob
      const { id: fileBlobId } = await this.fileBlobRepository.createFileBlob(
        {
          ...fileMetadata,
          fileId,
        },
        {
          transaction: t,
        },
      );

      // Upload the file using the name
      await this.pick(settingsContainer.filesystemType).uploadFile(
        fileBlobId,
        file.buffer,
        settingsContainer.path,
      );

      return { fileId };
    });
  };

  public downloadFile = async (
    fileId: string,
    warehouseName: string,
    options?: DownloadFileOptions,
  ): Promise<Buffer> => {
    const { File, ...metadata } =
      await this.fileBlobRepository.findLastFileBlobByFileIdAndWarehouseName(
        fileId,
        warehouseName,
      );

    const warehouseSettings = this.warehouseSettings.find(
      (ws) => ws.warehouse === warehouseName,
    );

    if (!warehouseSettings) throw new InternalServerErrorException();

    return await this.pick(warehouseSettings.filesystemType).downloadFile(
      metadata.id,
      warehouseSettings.path,
    );
  };
}

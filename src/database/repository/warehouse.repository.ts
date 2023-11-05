import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';
import { File, FileBlob } from '@prisma/client';
import { RepositoryOptions } from 'src/types/database/repository/repository-options.type';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFileMetadataById(fileId: string) {
    return await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        FileBlob: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findAllWarehouses() {
    return await this.prisma.warehouse.findMany();
  }

  async findFileMetadataByWarehouseNameAndId(
    warehouseName: string,
    fileId: string,
  ) {
    return await this.prisma.fileBlob.findFirst({
      where: {
        File: {
          id: fileId,
          Container: {
            Warehouse: {
              name: warehouseName,
            },
          },
        },
      },
      include: {
        File: {
          include: {
            Container: {
              include: {
                Warehouse: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findWarehouseByName(warehouseName: string) {
    return await this.prisma.warehouse.findFirst({
      where: {
        name: warehouseName,
      },
    });
  }

  async findContainerByNameAndWarehouseName(
    containerName: string,
    warehouseName: string,
  ) {
    return await this.prisma.container.findFirst({
      where: {
        name: containerName,
        Warehouse: {
          name: warehouseName,
        },
      },
      include: {
        Warehouse: true,
      },
    });
  }

  async findContainerById(containerId: string) {
    return await this.prisma.container.findUnique({
      where: {
        id: containerId,
      },
    });
  }

  async findFirstContainerByWarehouseId(warehouseId: string) {
    return await this.prisma.container.findFirst({
      where: {
        warehouseId,
      },
      orderBy: {
        name: 'desc',
      },
    });
  }

  async createFile(
    file: Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.prisma).file.create({
      data: file,
    });
  }

  async createFileBlob(
    file: Omit<FileBlob, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.prisma).fileBlob.create({
      data: file,
    });
  }

  async findLastFileBlobByFileIdAndWarehouseName(
    fileId: string,
    warehouseName: string,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.prisma).fileBlob.findFirst({
      where: {
        File: {
          id: fileId,
          Container: {
            Warehouse: {
              name: warehouseName,
            },
          },
        },
      },
      include: {
        File: {
          include: {
            Container: {
              include: {
                Warehouse: true,
              },
            },
          },
        },
      },
    });
  }
}

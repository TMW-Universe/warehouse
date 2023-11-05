import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';
import { FileBlob } from '@prisma/client';
import { RepositoryOptions } from 'src/types/database/repository/repository-options.type';

@Injectable()
export class FileBlobRepository {
  constructor(private readonly prisma: PrismaService) {}

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

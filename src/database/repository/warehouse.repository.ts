import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';

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
}

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
}

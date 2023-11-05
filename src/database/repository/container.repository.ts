import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';

@Injectable()
export class ContainerRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}

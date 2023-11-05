import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWarehouses() {
    return await this.prisma.warehouse.findMany();
  }

  async findWarehouseByName(warehouseName: string) {
    return await this.prisma.warehouse.findFirst({
      where: {
        name: warehouseName,
      },
    });
  }
}

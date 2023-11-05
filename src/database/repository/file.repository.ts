import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma.service';
import { File } from '@prisma/client';
import { RepositoryOptions } from 'src/types/database/repository/repository-options.type';

@Injectable()
export class FileRepository {
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

  async createFile(
    file: Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.prisma).file.create({
      data: file,
    });
  }
}

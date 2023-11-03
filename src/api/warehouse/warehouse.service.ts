import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WarehouseRepository } from 'src/database/repository/warehouse.repository';
import { KeysService } from '../keys/keys.service';
import { AccessToken } from 'src/types/token/access-token.type';
import { isPast } from 'date-fns';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    private readonly keysService: KeysService,
  ) {}

  async getFileMetadataById(fileId: string) {
    return await this.warehouseRepository.findFileMetadataById(fileId);
  }

  async readFileByToken(token: string) {
    const accessToken: AccessToken = JSON.parse(token);
    const { fileId, expiresAt } = await this.keysService.decodeAccessToken(
      accessToken.w,
      accessToken.st,
    );

    if (isPast(new Date(expiresAt))) throw new UnauthorizedException();

    return await this.getFileMetadataById(fileId); // Must check warehouse name too
  }
}

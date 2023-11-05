import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { AccessToken } from 'src/decorators/access-token.decorator';
import { ApiKeyGuard, HeaderApiKey } from 'nestjs-api-keys';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiPermissions } from 'src/utils/types/permissions/api-permissions.enum';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('file')
  async streamFileById(@AccessToken() token: string) {
    return await this.warehouseService.streamFileByToken(token);
  }

  @UseGuards(ApiKeyGuard({ permissions: [ApiPermissions.UPLOAD_FILE] }))
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @HeaderApiKey() apiKey: string,
  ) {
    return await this.warehouseService.uploadFileByApiKey(apiKey, file);
  }

  @Get('file/metadata')
  async getFileMetadataById(@AccessToken() token: string) {
    return await this.warehouseService.getFileMetadataByToken(token);
  }
}

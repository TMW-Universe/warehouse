import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { KeysService } from '../keys/keys.service';

@Module({
  controllers: [SetupController],
  providers: [SetupService, KeysService],
})
export class SetupModule {}

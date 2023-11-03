import { IsString } from 'class-validator';

export class VerifyKeyDTO {
  @IsString()
  message: string;
}

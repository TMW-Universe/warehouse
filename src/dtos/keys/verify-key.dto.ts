import { IsString } from 'class-validator';

export class VerifyKeyDTO {
  @IsString()
  token: string;
}

import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SignDTO {
  @IsString()
  @IsUUID('4')
  fileId: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  expiresAt?: Date;
}

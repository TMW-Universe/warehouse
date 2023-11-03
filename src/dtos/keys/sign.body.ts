import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SignDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  fileIds: string[];

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  expiresAt?: Date;
}

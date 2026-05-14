import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailTemplateRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  preheader!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body!: string;
}

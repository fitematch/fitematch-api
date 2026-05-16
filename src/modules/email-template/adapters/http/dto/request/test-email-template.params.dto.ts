import { IsNotEmpty, IsString } from 'class-validator';

export class TestEmailTemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

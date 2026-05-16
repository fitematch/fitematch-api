import { IsNotEmpty, IsString } from 'class-validator';

export class ReadEmailTemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

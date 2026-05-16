import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailTemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

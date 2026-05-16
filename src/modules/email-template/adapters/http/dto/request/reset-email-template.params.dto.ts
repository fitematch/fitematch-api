import { IsNotEmpty, IsString } from 'class-validator';

export class ResetEmailTemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

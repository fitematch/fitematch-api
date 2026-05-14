import { IsMongoId } from 'class-validator';

export class ResetEmailTemplateParamsDto {
  @IsMongoId()
  id!: string;
}

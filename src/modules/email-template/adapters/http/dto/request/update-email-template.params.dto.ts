import { IsMongoId } from 'class-validator';

export class UpdateEmailTemplateParamsDto {
  @IsMongoId()
  id!: string;
}

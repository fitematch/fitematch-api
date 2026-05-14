import { IsMongoId } from 'class-validator';

export class ReadEmailTemplateParamsDto {
  @IsMongoId()
  id!: string;
}

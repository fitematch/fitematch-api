import { IsMongoId } from 'class-validator';

export class TestEmailTemplateParamsDto {
  @IsMongoId()
  id!: string;
}

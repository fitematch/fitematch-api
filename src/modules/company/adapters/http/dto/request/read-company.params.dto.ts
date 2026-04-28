import { IsMongoId } from 'class-validator';

export class ReadCompanyParamsDto {
  @IsMongoId()
  companyId!: string;
}

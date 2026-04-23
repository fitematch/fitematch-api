import { IsString } from 'class-validator';

export class UpdateCompanyParamsDto {
  @IsString()
  companyId!: string;
}

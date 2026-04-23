import { IsString } from 'class-validator';

export class DeleteCompanyParamsDto {
  @IsString()
  companyId!: string;
}

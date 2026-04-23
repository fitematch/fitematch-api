import { IsString } from 'class-validator';

export class ReadCompanyParamsDto {
  @IsString()
  companyId!: string;
}

import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

export class ListCompanyQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CompanyStatusEnum)
  status?: CompanyStatusEnum;
}

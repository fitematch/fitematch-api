import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export class ListJobQueryDto {
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
  @IsEnum(JobStatusEnum)
  status?: JobStatusEnum;

  @IsOptional()
  @IsString()
  companyId?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';

class UpdateJobMediaResponseDto {
  @ApiPropertyOptional()
  coverUrl?: string;
}

export class UpdateJobResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  slots!: number;

  @ApiProperty({
    enum: JobContractTypeEnum,
  })
  contractType!: JobContractTypeEnum;

  @ApiPropertyOptional()
  requirements?: unknown;

  @ApiPropertyOptional()
  benefits?: unknown;

  @ApiPropertyOptional({
    type: UpdateJobMediaResponseDto,
  })
  media?: UpdateJobMediaResponseDto;

  @ApiProperty({
    enum: JobStatusEnum,
  })
  status!: JobStatusEnum;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

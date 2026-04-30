import { ApiProperty } from '@nestjs/swagger';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

class JobCompanyAddressResponseDto {
  @ApiProperty({ required: false })
  street?: string;

  @ApiProperty({ required: false })
  number?: string;

  @ApiProperty({ required: false })
  complement?: string;

  @ApiProperty({ required: false })
  neighborhood?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  zipCode?: string;
}

class JobCompanyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tradeName!: string;

  @ApiProperty({
    required: false,
    type: JobCompanyAddressResponseDto,
  })
  address?: JobCompanyAddressResponseDto;
}

export class ListJobResponseDto {
  @ApiProperty()
  id!: string;

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

  @ApiProperty({ enum: JobContractTypeEnum })
  contractType!: JobContractTypeEnum;

  @ApiProperty({
    required: false,
    type: JobCompanyResponseDto,
  })
  company?: JobCompanyResponseDto;

  @ApiProperty({ enum: JobStatusEnum })
  status!: JobStatusEnum;
}

import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class JobAppliesDetailsDto {
  @ApiProperty()
  jobTitle!: string;

  @ApiProperty()
  tradeName!: string;

  @ApiProperty()
  logoUrl!: string;
}

export class ListMyAppliesResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  details!: JobAppliesDetailsDto;

  @ApiProperty({ enum: ApplicationStatusEnum })
  status!: ApplicationStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

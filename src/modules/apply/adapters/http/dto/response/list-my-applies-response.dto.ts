import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatusEnum } from '../../../../domain/enums/application-status.enum';

export class ListMyAppliesResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ApplicationStatusEnum })
  status!: ApplicationStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

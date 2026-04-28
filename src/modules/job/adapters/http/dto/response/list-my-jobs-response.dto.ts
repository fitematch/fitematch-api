import { ApiProperty } from '@nestjs/swagger';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

class ListMyJobsMediaResponseDto {
  @ApiProperty({ required: false })
  coverUrl?: string;
}

export class ListMyJobsResponseDto {
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

  @ApiProperty({ required: false })
  requirements?: unknown;

  @ApiProperty({ required: false })
  benefits?: unknown;

  @ApiProperty({
    required: false,
    type: ListMyJobsMediaResponseDto,
  })
  media?: ListMyJobsMediaResponseDto;

  @ApiProperty({ enum: JobStatusEnum })
  status!: JobStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

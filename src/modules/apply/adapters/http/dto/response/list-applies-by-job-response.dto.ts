import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class UserAppliesByJobResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  birthday?: string;

  @ApiProperty({ required: false })
  resumeUrl?: string;
}

export class ListAppliesByJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ required: false, type: UserAppliesByJobResponseDto })
  user?: UserAppliesByJobResponseDto;

  @ApiProperty({ enum: ApplicationStatusEnum })
  status!: ApplicationStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

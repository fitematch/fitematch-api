import { ApiProperty } from '@nestjs/swagger';

import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class UpdateApplyResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({
    enum: ApplicationStatusEnum,
  })
  status!: ApplicationStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

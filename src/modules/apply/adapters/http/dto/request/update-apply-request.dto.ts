import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class UpdateApplyRequestDto {
  @ApiProperty({
    enum: ApplicationStatusEnum,
    example: ApplicationStatusEnum.SHORTLISTED,
  })
  @IsEnum(ApplicationStatusEnum)
  status!: ApplicationStatusEnum;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class CreateApplyRequestDto {
  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional({ enum: ApplicationStatusEnum })
  status?: ApplicationStatusEnum;
}

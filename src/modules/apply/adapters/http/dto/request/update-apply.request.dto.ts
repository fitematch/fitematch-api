import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class UpdateApplyRequestDto {
  @ApiPropertyOptional({ enum: ApplicationStatusEnum })
  status?: ApplicationStatusEnum;
}

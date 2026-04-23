import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListApplyRequestDto {
  @ApiPropertyOptional()
  userId?: string;

  @ApiPropertyOptional()
  jobId?: string;

  @ApiPropertyOptional()
  status?: string;
}

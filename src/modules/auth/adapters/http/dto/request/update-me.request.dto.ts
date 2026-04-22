import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMeRequestDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  birthday?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryGroupResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  lastWeek!: number;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ type: DashboardSummaryGroupResponseDto })
  users!: DashboardSummaryGroupResponseDto;

  @ApiProperty({ type: DashboardSummaryGroupResponseDto })
  companies!: DashboardSummaryGroupResponseDto;

  @ApiProperty({ type: DashboardSummaryGroupResponseDto })
  jobs!: DashboardSummaryGroupResponseDto;

  @ApiProperty({ type: DashboardSummaryGroupResponseDto })
  applications!: DashboardSummaryGroupResponseDto;
}

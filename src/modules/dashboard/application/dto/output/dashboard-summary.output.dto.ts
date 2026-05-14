export class DashboardSummaryGroupOutputDto {
  total!: number;
  lastWeek!: number;
}

export class DashboardSummaryOutputDto {
  users!: DashboardSummaryGroupOutputDto;
  companies!: DashboardSummaryGroupOutputDto;
  jobs!: DashboardSummaryGroupOutputDto;
  applications!: DashboardSummaryGroupOutputDto;
}

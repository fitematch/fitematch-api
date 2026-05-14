import type { DashboardSummaryOutputDto } from '@src/modules/dashboard/application/dto/output/dashboard-summary.output.dto';

export interface DashboardSummaryUseCaseInterface {
  execute(): Promise<DashboardSummaryOutputDto>;
}

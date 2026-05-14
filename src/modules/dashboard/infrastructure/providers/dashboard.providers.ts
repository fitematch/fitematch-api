import type { Provider } from '@nestjs/common';
import {
  DASHBOARD_SUMMARY_REPOSITORY,
  DASHBOARD_SUMMARY_USE_CASE,
} from '@src/modules/dashboard/application/contracts/tokens/dashboard.tokens';
import { DashboardSummaryUseCase } from '@src/modules/dashboard/application/use-cases/dashboard-summary.use-case';
import { DashboardSummaryRepository } from '@src/modules/dashboard/infrastructure/repositories/dashboard-summary.repository';

export const dashboardProviders: Provider[] = [
  {
    provide: DASHBOARD_SUMMARY_USE_CASE,
    useClass: DashboardSummaryUseCase,
  },
  {
    provide: DASHBOARD_SUMMARY_REPOSITORY,
    useClass: DashboardSummaryRepository,
  },
];

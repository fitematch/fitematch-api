import { Inject, Injectable } from '@nestjs/common';
import { DASHBOARD_SUMMARY_REPOSITORY } from '@src/modules/dashboard/application/contracts/tokens/dashboard.tokens';
import type { DashboardSummaryRepositoryInterface } from '@src/modules/dashboard/application/contracts/repositories/dashboard-summary.repository.interface';
import type { DashboardSummaryUseCaseInterface } from '@src/modules/dashboard/application/contracts/use-cases/dashboard-summary.use-case.interface';
import type { DashboardSummaryOutputDto } from '@src/modules/dashboard/application/dto/output/dashboard-summary.output.dto';

@Injectable()
export class DashboardSummaryUseCase implements DashboardSummaryUseCaseInterface {
  constructor(
    @Inject(DASHBOARD_SUMMARY_REPOSITORY)
    private readonly dashboardSummaryRepository: DashboardSummaryRepositoryInterface,
  ) {}

  async execute(): Promise<DashboardSummaryOutputDto> {
    return this.dashboardSummaryRepository.summary();
  }
}

import type { DashboardSummaryOutputDto } from '@src/modules/dashboard/application/dto/output/dashboard-summary.output.dto';
import type { DashboardSummaryResponseDto } from '@src/modules/dashboard/adapters/http/dto/response/dashboard-summary.response.dto';

export class DashboardSummaryMapper {
  static toResponse(
    output: DashboardSummaryOutputDto,
  ): DashboardSummaryResponseDto {
    return {
      users: output.users,
      companies: output.companies,
      jobs: output.jobs,
      applications: output.applications,
    };
  }
}

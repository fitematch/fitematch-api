import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DASHBOARD_SUMMARY_USE_CASE } from '@src/modules/dashboard/application/contracts/tokens/dashboard.tokens';
import type { DashboardSummaryUseCaseInterface } from '@src/modules/dashboard/application/contracts/use-cases/dashboard-summary.use-case.interface';
import { DashboardSummaryResponseDto } from '@src/modules/dashboard/adapters/http/dto/response/dashboard-summary.response.dto';
import { DashboardSummaryMapper } from '@src/modules/dashboard/adapters/http/mappers/dashboard-summary.mapper';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardSummaryController {
  constructor(
    @Inject(DASHBOARD_SUMMARY_USE_CASE)
    private readonly dashboardSummaryUseCase: DashboardSummaryUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Get dashboard summary',
    description: 'Returns the dashboard summary metrics.',
  })
  @ApiOkResponse({
    description: 'Dashboard summary returned successfully.',
    type: DashboardSummaryResponseDto,
  })
  @Get('summary')
  async handle(): Promise<DashboardSummaryResponseDto> {
    const result = await this.dashboardSummaryUseCase.execute();

    return DashboardSummaryMapper.toResponse(result);
  }
}

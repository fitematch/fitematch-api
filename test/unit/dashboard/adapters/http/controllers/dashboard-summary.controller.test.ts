import { DashboardSummaryController } from '@src/modules/dashboard/adapters/http/controllers/dashboard-summary.controller';
import type { DashboardSummaryUseCaseInterface } from '@src/modules/dashboard/application/contracts/use-cases/dashboard-summary.use-case.interface';

describe('DashboardSummaryController', () => {
  let controller: DashboardSummaryController;
  let dashboardSummaryUseCase: jest.Mocked<DashboardSummaryUseCaseInterface>;

  beforeEach(() => {
    dashboardSummaryUseCase = {
      execute: jest.fn(),
    };

    controller = new DashboardSummaryController(dashboardSummaryUseCase);
  });

  describe('handle', () => {
    it('should return the mapped dashboard summary', async () => {
      const output = {
        users: {
          total: 120,
          lastWeek: 9,
        },
        companies: {
          total: 42,
          lastWeek: 4,
        },
        jobs: {
          total: 88,
          lastWeek: 7,
        },
        applications: {
          total: 310,
          lastWeek: 21,
        },
      };

      dashboardSummaryUseCase.execute.mockResolvedValue(output);

      const result = await controller.handle();

      expect(result).toEqual(output);
      expect(dashboardSummaryUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});

import type { DashboardSummaryRepositoryInterface } from '@src/modules/dashboard/application/contracts/repositories/dashboard-summary.repository.interface';
import { DashboardSummaryUseCase } from '@src/modules/dashboard/application/use-cases/dashboard-summary.use-case';

describe('DashboardSummaryUseCase', () => {
  let useCase: DashboardSummaryUseCase;
  let dashboardSummaryRepository: jest.Mocked<DashboardSummaryRepositoryInterface>;

  beforeEach(() => {
    dashboardSummaryRepository = {
      summary: jest.fn(),
    };

    useCase = new DashboardSummaryUseCase(dashboardSummaryRepository);
  });

  describe('execute', () => {
    it('should return the dashboard summary', async () => {
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

      dashboardSummaryRepository.summary.mockResolvedValue(output);

      const result = await useCase.execute();

      expect(result).toEqual(output);
      expect(dashboardSummaryRepository.summary).toHaveBeenCalledTimes(1);
    });
  });
});

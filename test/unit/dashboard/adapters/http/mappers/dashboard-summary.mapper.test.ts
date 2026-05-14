import { DashboardSummaryMapper } from '@src/modules/dashboard/adapters/http/mappers/dashboard-summary.mapper';

describe('DashboardSummaryMapper', () => {
  describe('toResponse', () => {
    it('should map the dashboard summary output to the response dto', () => {
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

      const result = DashboardSummaryMapper.toResponse(output);

      expect(result).toEqual(output);
    });
  });
});

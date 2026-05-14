jest.mock(
  '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema',
  () => ({
    UserSchema: class UserSchema {},
  }),
);

jest.mock(
  '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema',
  () => ({
    CompanySchema: class CompanySchema {},
  }),
);

jest.mock(
  '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema',
  () => ({
    JobSchema: class JobSchema {},
  }),
);

jest.mock(
  '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema',
  () => ({
    ApplySchema: class ApplySchema {},
  }),
);

import { DashboardSummaryRepository } from '@src/modules/dashboard/infrastructure/repositories/dashboard-summary.repository';

type CountDocumentsQueryMock = {
  exec: jest.Mock<Promise<number>, []>;
};

type CountDocumentsModelMock = {
  countDocuments: jest.Mock<
    CountDocumentsQueryMock,
    [Record<string, unknown>?]
  >;
};

const createCountDocumentsModelMock = (
  values: number[],
): CountDocumentsModelMock => {
  const execMocks = values.map((value) => jest.fn().mockResolvedValue(value));

  return {
    countDocuments: jest
      .fn<CountDocumentsQueryMock, [Record<string, unknown>?]>()
      .mockImplementation(() => {
        const exec = execMocks.shift();

        if (!exec) {
          throw new Error('Unexpected countDocuments call');
        }

        return { exec };
      }),
  };
};

describe('DashboardSummaryRepository', () => {
  describe('summary', () => {
    it('should return aggregated totals and last week totals for all resources', async () => {
      const userModel = createCountDocumentsModelMock([120, 9]);
      const companyModel = createCountDocumentsModelMock([42, 4]);
      const jobModel = createCountDocumentsModelMock([88, 7]);
      const applyModel = createCountDocumentsModelMock([310, 21]);

      const repository = new DashboardSummaryRepository(
        userModel as never,
        companyModel as never,
        jobModel as never,
        applyModel as never,
      );

      const beforeExecution = Date.now();
      const result = await repository.summary();
      const afterExecution = Date.now();

      expect(result).toEqual({
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
      });

      expect(userModel.countDocuments).toHaveBeenNthCalledWith(1);
      expect(companyModel.countDocuments).toHaveBeenNthCalledWith(1);
      expect(jobModel.countDocuments).toHaveBeenNthCalledWith(1);
      expect(applyModel.countDocuments).toHaveBeenNthCalledWith(1);

      const lastWeekUserFilter = userModel.countDocuments.mock.calls[1]?.[0];
      const lastWeekCompanyFilter =
        companyModel.countDocuments.mock.calls[1]?.[0];
      const lastWeekJobFilter = jobModel.countDocuments.mock.calls[1]?.[0];
      const lastWeekApplyFilter = applyModel.countDocuments.mock.calls[1]?.[0];

      expect(lastWeekUserFilter).toEqual({
        createdAt: {
          $gte: expect.any(Date),
        },
      });
      expect(lastWeekCompanyFilter).toEqual({
        createdAt: {
          $gte: expect.any(Date),
        },
      });
      expect(lastWeekJobFilter).toEqual({
        createdAt: {
          $gte: expect.any(Date),
        },
      });
      expect(lastWeekApplyFilter).toEqual({
        createdAt: {
          $gte: expect.any(Date),
        },
      });

      const userLastWeekDate = (
        lastWeekUserFilter as { createdAt: { $gte: Date } }
      ).createdAt.$gte.getTime();

      expect(userLastWeekDate).toBeGreaterThanOrEqual(
        beforeExecution - 7 * 24 * 60 * 60 * 1000,
      );
      expect(userLastWeekDate).toBeLessThanOrEqual(
        afterExecution - 7 * 24 * 60 * 60 * 1000,
      );
    });
  });
});

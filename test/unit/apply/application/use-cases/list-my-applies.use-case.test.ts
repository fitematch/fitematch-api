import { ListMyAppliesUseCase } from '@src/modules/apply/application/use-cases/list-my-applies.use-case';
import type { ListMyAppliesRepository } from '@src/modules/apply/application/contracts/repositories/list-my-applies.repository';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('ListMyAppliesUseCase', () => {
  let useCase: ListMyAppliesUseCase;
  let listMyAppliesRepository: jest.Mocked<ListMyAppliesRepository>;

  beforeEach(() => {
    listMyAppliesRepository = {
      findByUserId: jest.fn(),
    } as jest.Mocked<ListMyAppliesRepository>;

    useCase = new ListMyAppliesUseCase(listMyAppliesRepository);
  });

  describe('execute', () => {
    describe('when applications are found for the user', () => {
      it('should return the mapped list of applications', async () => {
        const input = {
          userId: 'user-id-1',
        };

        const applies = [
          {
            _id: 'apply-id-1',
            jobId: 'job-id-1',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.APPLIED,
            details: {
              jobTitle: 'Frontend Engineer',
              tradeName: 'Fit Match',
              logoUrl: 'https://example.com/logo-1.png',
            },
            createdAt: new Date('2026-04-28T10:00:00.000Z'),
            updatedAt: new Date('2026-04-28T10:30:00.000Z'),
          },
          {
            _id: 'apply-id-2',
            jobId: 'job-id-2',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.SHORTLISTED,
            details: {
              jobTitle: 'Backend Engineer',
              tradeName: 'Fit Match',
              logoUrl: 'https://example.com/logo-2.png',
            },
            createdAt: new Date('2026-04-28T11:00:00.000Z'),
            updatedAt: new Date('2026-04-28T11:15:00.000Z'),
          },
        ];

        listMyAppliesRepository.findByUserId.mockResolvedValue(applies);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            id: 'apply-id-1',
            jobId: 'job-id-1',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.APPLIED,
            details: {
              jobTitle: 'Frontend Engineer',
              tradeName: 'Fit Match',
              logoUrl: 'https://example.com/logo-1.png',
            },
            createdAt: new Date('2026-04-28T10:00:00.000Z'),
            updatedAt: new Date('2026-04-28T10:30:00.000Z'),
          },
          {
            id: 'apply-id-2',
            jobId: 'job-id-2',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.SHORTLISTED,
            details: {
              jobTitle: 'Backend Engineer',
              tradeName: 'Fit Match',
              logoUrl: 'https://example.com/logo-2.png',
            },
            createdAt: new Date('2026-04-28T11:00:00.000Z'),
            updatedAt: new Date('2026-04-28T11:15:00.000Z'),
          },
        ]);
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledWith(
          input.userId,
        );
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when no applications are found for the user', () => {
      it('should return an empty list', async () => {
        const input = {
          userId: 'missing-user-id',
        };

        listMyAppliesRepository.findByUserId.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual([]);
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledWith(
          input.userId,
        );
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          userId: 'user-id-error',
        };
        const error = new Error('Repository error');

        listMyAppliesRepository.findByUserId.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledWith(
          input.userId,
        );
        expect(listMyAppliesRepository.findByUserId).toHaveBeenCalledTimes(1);
      });
    });
  });
});

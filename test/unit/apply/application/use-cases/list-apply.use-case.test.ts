import { ListApplyUseCase } from '@src/modules/apply/application/use-cases/list-apply.use-case';
import type { ListApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/list-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('ListApplyUseCase', () => {
  let useCase: ListApplyUseCase;
  let listApplyRepository: jest.Mocked<ListApplyRepositoryInterface>;

  beforeEach(() => {
    listApplyRepository = {
      list: jest.fn(),
    } as jest.Mocked<ListApplyRepositoryInterface>;

    useCase = new ListApplyUseCase(listApplyRepository);
  });

  describe('execute', () => {
    describe('when applications are found', () => {
      it('should return a list of applications', async () => {
        const input = {
          page: 1,
          limit: 10,
          jobId: 'job-id-1',
          userId: 'user-id-1',
          status: ApplicationStatusEnum.APPLIED,
        };

        const applies = [
          {
            id: 'apply-1',
            jobId: 'job-id-1',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.APPLIED,
            createdAt: new Date('2026-04-19T10:00:00.000Z'),
            updatedAt: new Date('2026-04-19T10:10:00.000Z'),
          },
          {
            id: 'apply-2',
            jobId: 'job-id-1',
            userId: 'user-id-2',
            status: ApplicationStatusEnum.SHORTLISTED,
            createdAt: new Date('2026-04-19T11:00:00.000Z'),
            updatedAt: new Date('2026-04-19T11:20:00.000Z'),
          },
        ];

        listApplyRepository.list.mockResolvedValue(applies);

        const result = await useCase.execute(input);

        expect(result).toEqual(applies);
        expect(listApplyRepository.list).toHaveBeenCalledWith(input);
        expect(listApplyRepository.list).toHaveBeenCalledTimes(1);
      });

      it('should map all application fields from repository output', async () => {
        const input = { page: 2, limit: 1 };

        const createdAt = new Date('2026-04-19T12:00:00.000Z');
        const updatedAt = new Date('2026-04-19T12:30:00.000Z');

        listApplyRepository.list.mockResolvedValue([
          {
            id: 'apply-3',
            jobId: 'job-id-3',
            userId: 'user-id-3',
            status: ApplicationStatusEnum.HIRED,
            createdAt,
            updatedAt,
          },
        ]);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            id: 'apply-3',
            jobId: 'job-id-3',
            userId: 'user-id-3',
            status: ApplicationStatusEnum.HIRED,
            createdAt,
            updatedAt,
          },
        ]);
        expect(listApplyRepository.list).toHaveBeenCalledWith(input);
        expect(listApplyRepository.list).toHaveBeenCalledTimes(1);
      });
    });

    describe('when no applications are found', () => {
      it('should return an empty array', async () => {
        const input = {
          userId: 'missing-user-id',
        };

        listApplyRepository.list.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual([]);
        expect(listApplyRepository.list).toHaveBeenCalledWith(input);
        expect(listApplyRepository.list).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          status: ApplicationStatusEnum.REJECTED,
        };
        const errorMessage = 'Repository error';

        listApplyRepository.list.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(listApplyRepository.list).toHaveBeenCalledWith(input);
        expect(listApplyRepository.list).toHaveBeenCalledTimes(1);
      });
    });
  });
});

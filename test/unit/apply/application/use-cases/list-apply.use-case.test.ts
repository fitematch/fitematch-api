import { ListApplyUseCase } from '@src/modules/apply/application/use-cases/list-apply.use-case';
import type { ListApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/list-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('ListApplyUseCase', () => {
  let useCase: ListApplyUseCase;
  let listApplyRepository: jest.Mocked<ListApplyRepositoryInterface>;

  beforeEach(() => {
    listApplyRepository = {
      list: jest.fn(),
      findByUserId: jest.fn(),
    } as jest.Mocked<ListApplyRepositoryInterface>;

    useCase = new ListApplyUseCase(listApplyRepository);
  });

  it('returns a mapped list of applications', async () => {
    const input = {
      page: 1,
      limit: 10,
      jobId: 'job-id-1',
      userId: 'user-id-1',
      status: ApplicationStatusEnum.APPLIED,
    };

    const applies = [
      {
        _id: 'apply-1',
        jobId: 'job-id-1',
        userId: 'user-id-1',
        status: ApplicationStatusEnum.APPLIED,
        createdAt: new Date('2026-04-19T10:00:00.000Z'),
        updatedAt: new Date('2026-04-19T10:10:00.000Z'),
      },
      {
        _id: 'apply-2',
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
  });

  it('returns an empty array when no applications are found', async () => {
    const input = {
      userId: 'missing-user-id',
    };

    listApplyRepository.list.mockResolvedValue([]);

    const result = await useCase.execute(input);

    expect(result).toEqual([]);
    expect(listApplyRepository.list).toHaveBeenCalledWith(input);
  });
});

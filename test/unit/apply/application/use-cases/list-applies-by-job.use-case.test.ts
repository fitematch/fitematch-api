import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ListAppliesByJobUseCase } from '@src/modules/apply/application/use-cases/list-applies-by-job.use-case';
import type { ListAppliesByJobRepository } from '@src/modules/apply/application/contracts/repositories/list-applies-by-job.repository';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';

describe('ListAppliesByJobUseCase', () => {
  let useCase: ListAppliesByJobUseCase;
  let listAppliesByJobRepository: jest.Mocked<ListAppliesByJobRepository>;
  let readJobRepository: jest.Mocked<ReadJobRepositoryInterface>;

  const applies = [
    {
      _id: 'apply-id-1',
      jobId: 'job-id-1',
      userId: 'user-id-1',
      status: ApplicationStatusEnum.APPLIED,
      createdAt: new Date('2026-04-28T12:00:00.000Z'),
      updatedAt: new Date('2026-04-28T12:20:00.000Z'),
    },
    {
      _id: 'apply-id-2',
      jobId: 'job-id-1',
      userId: 'user-id-2',
      status: ApplicationStatusEnum.HIRED,
      createdAt: new Date('2026-04-28T13:00:00.000Z'),
      updatedAt: new Date('2026-04-28T13:10:00.000Z'),
    },
  ];

  beforeEach(() => {
    listAppliesByJobRepository = {
      findByJobId: jest.fn(),
    } as jest.Mocked<ListAppliesByJobRepository>;

    readJobRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadJobRepositoryInterface>;

    useCase = new ListAppliesByJobUseCase(
      listAppliesByJobRepository,
      readJobRepository,
    );
  });

  it('returns the mapped list when recruiter owns the job', async () => {
    readJobRepository.read.mockResolvedValue({
      _id: 'job-id-1',
      companyId: 'company-id-1',
    } as never);
    listAppliesByJobRepository.findByJobId.mockResolvedValue(applies);

    const result = await useCase.execute({
      jobId: 'job-id-1',
      recruiterCompanyId: 'company-id-1',
    });

    expect(result).toEqual([
      {
        id: 'apply-id-1',
        jobId: 'job-id-1',
        userId: 'user-id-1',
        status: ApplicationStatusEnum.APPLIED,
        createdAt: new Date('2026-04-28T12:00:00.000Z'),
        updatedAt: new Date('2026-04-28T12:20:00.000Z'),
      },
      {
        id: 'apply-id-2',
        jobId: 'job-id-1',
        userId: 'user-id-2',
        status: ApplicationStatusEnum.HIRED,
        createdAt: new Date('2026-04-28T13:00:00.000Z'),
        updatedAt: new Date('2026-04-28T13:10:00.000Z'),
      },
    ]);
    expect(readJobRepository.read).toHaveBeenCalledWith({ _id: 'job-id-1' });
    expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledWith(
      'job-id-1',
    );
  });

  it('throws when the job does not exist', async () => {
    readJobRepository.read.mockResolvedValue(null);

    await expect(
      useCase.execute({
        jobId: 'missing-job-id',
        recruiterCompanyId: 'company-id-1',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(listAppliesByJobRepository.findByJobId).not.toHaveBeenCalled();
  });

  it('throws when recruiter does not own the job', async () => {
    readJobRepository.read.mockResolvedValue({
      _id: 'job-id-1',
      companyId: 'other-company-id',
    } as never);

    await expect(
      useCase.execute({
        jobId: 'job-id-1',
        recruiterCompanyId: 'company-id-1',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(listAppliesByJobRepository.findByJobId).not.toHaveBeenCalled();
  });
});

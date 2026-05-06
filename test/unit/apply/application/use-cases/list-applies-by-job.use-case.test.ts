import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ListAppliesByJobUseCase } from '@src/modules/apply/application/use-cases/list-applies-by-job.use-case';
import type { ListAppliesByJobRepository } from '@src/modules/apply/application/contracts/repositories/list-applies-by-job.repository';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';

describe('ListAppliesByJobUseCase', () => {
  let useCase: ListAppliesByJobUseCase;
  let listAppliesByJobRepository: jest.Mocked<ListAppliesByJobRepository>;
  let readJobRepository: jest.Mocked<ReadJobRepositoryInterface>;
  let readUserRepository: jest.Mocked<ReadUserRepositoryInterface>;

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

    readUserRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadUserRepositoryInterface>;

    useCase = new ListAppliesByJobUseCase(
      listAppliesByJobRepository,
      readJobRepository,
      readUserRepository,
    );
  });

  it('returns the list with user data when recruiter owns the job', async () => {
    readJobRepository.read.mockResolvedValue({
      _id: 'job-id-1',
      companyId: 'company-id-1',
    } as never);
    listAppliesByJobRepository.findByJobId.mockResolvedValue(applies);
    readUserRepository.read
      .mockResolvedValueOnce({
        _id: 'user-id-1',
        name: 'User One',
        email: 'user-one@example.com',
        birthday: '1990-01-10',
        candidateProfile: {
          media: {
            resumeUrl: 'https://cdn.example.com/resume-user-1.pdf',
          },
        },
        status: 'ACTIVE',
      } as never)
      .mockResolvedValueOnce({
        _id: 'user-id-2',
        name: 'User Two',
        email: 'user-two@example.com',
        birthday: '1992-03-15',
        candidateProfile: {},
        status: 'ACTIVE',
      } as never);

    const result = await useCase.execute({
      jobId: 'job-id-1',
      recruiterCompanyId: 'company-id-1',
    });

    expect(result).toEqual([
      {
        id: 'apply-id-1',
        jobId: 'job-id-1',
        userId: 'user-id-1',
        user: {
          name: 'User One',
          birthday: '1990-01-10',
          resumeUrl: 'https://cdn.example.com/resume-user-1.pdf',
        },
        status: ApplicationStatusEnum.APPLIED,
        createdAt: new Date('2026-04-28T12:00:00.000Z'),
        updatedAt: new Date('2026-04-28T12:20:00.000Z'),
      },
      {
        id: 'apply-id-2',
        jobId: 'job-id-1',
        userId: 'user-id-2',
        user: {
          name: 'User Two',
          birthday: '1992-03-15',
          resumeUrl: undefined,
        },
        status: ApplicationStatusEnum.HIRED,
        createdAt: new Date('2026-04-28T13:00:00.000Z'),
        updatedAt: new Date('2026-04-28T13:10:00.000Z'),
      },
    ]);
    expect(readJobRepository.read).toHaveBeenCalledWith({ _id: 'job-id-1' });
    expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledWith(
      'job-id-1',
    );
    expect(readUserRepository.read).toHaveBeenNthCalledWith(1, {
      _id: 'user-id-1',
    });
    expect(readUserRepository.read).toHaveBeenNthCalledWith(2, {
      _id: 'user-id-2',
    });
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
    expect(readUserRepository.read).not.toHaveBeenCalled();
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
    expect(readUserRepository.read).not.toHaveBeenCalled();
  });
});

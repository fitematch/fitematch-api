import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ReadApplyUseCase } from '@src/modules/apply/application/use-cases/read-apply.use-case';
import type { ReadApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/read-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

describe('ReadApplyUseCase', () => {
  let useCase: ReadApplyUseCase;
  let readApplyRepository: jest.Mocked<ReadApplyRepositoryInterface>;
  let readJobRepository: jest.Mocked<ReadJobRepositoryInterface>;

  const existingApply = {
    _id: 'apply-id-1',
    jobId: 'job-id-1',
    userId: 'user-id-1',
    status: ApplicationStatusEnum.APPLIED,
    createdAt: new Date('2026-04-19T13:00:00.000Z'),
    updatedAt: new Date('2026-04-19T13:30:00.000Z'),
  };

  const existingJob = {
    _id: 'job-id-1',
    companyId: 'company-id-1',
    title: 'Instructor',
    description: 'Job description',
    slots: 1,
    contractType: undefined,
    status: undefined,
    createdAt: new Date('2026-04-19T13:00:00.000Z'),
    updatedAt: new Date('2026-04-19T13:30:00.000Z'),
  };

  beforeEach(() => {
    readApplyRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadApplyRepositoryInterface>;

    readJobRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadJobRepositoryInterface>;

    useCase = new ReadApplyUseCase(readApplyRepository, readJobRepository);
  });

  it('returns the application for the owning candidate', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'user-id-1',
      productRole: ProductRoleEnum.CANDIDATE,
    };

    readApplyRepository.read.mockResolvedValue(existingApply);

    const result = await useCase.execute(input);

    expect(result).toEqual(existingApply);
    expect(readApplyRepository.read).toHaveBeenCalledWith(input);
    expect(readJobRepository.read).not.toHaveBeenCalled();
  });

  it('returns the application for the recruiter that owns the job', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'recruiter-id-1',
      productRole: ProductRoleEnum.RECRUITER,
      recruiterCompanyId: 'company-id-1',
    };

    readApplyRepository.read.mockResolvedValue(existingApply);
    readJobRepository.read.mockResolvedValue(existingJob as never);

    const result = await useCase.execute(input);

    expect(result).toEqual(existingApply);
    expect(readApplyRepository.read).toHaveBeenCalledWith(input);
    expect(readJobRepository.read).toHaveBeenCalledWith({ _id: 'job-id-1' });
  });

  it('throws when the application does not exist', async () => {
    const input = {
      _id: 'missing-apply-id',
      userId: 'user-id-1',
      productRole: ProductRoleEnum.CANDIDATE,
    };

    readApplyRepository.read.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('throws when the candidate does not own the application', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'other-user-id',
      productRole: ProductRoleEnum.CANDIDATE,
    };

    readApplyRepository.read.mockResolvedValue(existingApply);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
  });

  it('throws when recruiter job is not found', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'recruiter-id-1',
      productRole: ProductRoleEnum.RECRUITER,
      recruiterCompanyId: 'company-id-1',
    };

    readApplyRepository.read.mockResolvedValue(existingApply);
    readJobRepository.read.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('throws when recruiter does not own the job', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'recruiter-id-1',
      productRole: ProductRoleEnum.RECRUITER,
      recruiterCompanyId: 'company-id-1',
    };

    readApplyRepository.read.mockResolvedValue(existingApply);
    readJobRepository.read.mockResolvedValue({
      ...existingJob,
      companyId: 'other-company-id',
    } as never);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
  });

  it('throws when recruiter company id is missing', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'recruiter-id-1',
      productRole: ProductRoleEnum.RECRUITER,
    };

    readApplyRepository.read.mockResolvedValue(existingApply);
    readJobRepository.read.mockResolvedValue(existingJob as never);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
  });

  it('throws when product role is unsupported', async () => {
    const input = {
      _id: 'apply-id-1',
      userId: 'user-id-1',
      productRole: 'admin' as ProductRoleEnum,
    };

    readApplyRepository.read.mockResolvedValue(existingApply);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
  });
});

import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { UpdateApplyUseCase } from '@src/modules/apply/application/use-cases/update-apply.use-case';
import type { UpdateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/update-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

describe('UpdateApplyUseCase', () => {
  let useCase: UpdateApplyUseCase;
  let updateApplyRepository: jest.Mocked<UpdateApplyRepositoryInterface>;
  let readJobRepository: jest.Mocked<ReadJobRepositoryInterface>;

  const input = {
    _id: 'apply-id-1',
    status: ApplicationStatusEnum.SHORTLISTED,
    productRole: ProductRoleEnum.RECRUITER,
    recruiterCompanyId: 'company-id-1',
  };

  const existingApply = {
    _id: 'apply-id-1',
    jobId: 'job-id-1',
    userId: 'user-id-1',
    status: ApplicationStatusEnum.APPLIED,
    createdAt: new Date('2026-04-19T14:00:00.000Z'),
    updatedAt: new Date('2026-04-19T14:30:00.000Z'),
  };

  const existingJob = {
    _id: 'job-id-1',
    companyId: 'company-id-1',
    title: 'Instructor',
    description: 'Job description',
    slots: 1,
    contractType: undefined,
    status: undefined,
    createdAt: new Date('2026-04-19T14:00:00.000Z'),
    updatedAt: new Date('2026-04-19T14:30:00.000Z'),
  };

  const updatedApply = {
    ...existingApply,
    status: ApplicationStatusEnum.SHORTLISTED,
  };

  beforeEach(() => {
    updateApplyRepository = {
      readById: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<UpdateApplyRepositoryInterface>;

    readJobRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadJobRepositoryInterface>;

    useCase = new UpdateApplyUseCase(updateApplyRepository, readJobRepository);
  });

  it('returns the updated application when recruiter owns the job', async () => {
    updateApplyRepository.readById.mockResolvedValue(existingApply as never);
    readJobRepository.read.mockResolvedValue(existingJob as never);
    updateApplyRepository.update.mockResolvedValue(updatedApply);

    const result = await useCase.execute(input);

    expect(result).toEqual(updatedApply);
    expect(updateApplyRepository.readById).toHaveBeenCalledWith('apply-id-1');
    expect(readJobRepository.read).toHaveBeenCalledWith({ _id: 'job-id-1' });
    expect(updateApplyRepository.update).toHaveBeenCalledWith(input);
  });

  it('throws when the apply does not exist', async () => {
    updateApplyRepository.readById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    expect(updateApplyRepository.update).not.toHaveBeenCalled();
  });

  it('throws when the job does not exist', async () => {
    updateApplyRepository.readById.mockResolvedValue(existingApply as never);
    readJobRepository.read.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    expect(updateApplyRepository.update).not.toHaveBeenCalled();
  });

  it('throws when recruiter does not own the job', async () => {
    updateApplyRepository.readById.mockResolvedValue(existingApply as never);
    readJobRepository.read.mockResolvedValue({
      ...existingJob,
      companyId: 'other-company-id',
    } as never);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
    expect(updateApplyRepository.update).not.toHaveBeenCalled();
  });

  it('throws when product role is not recruiter', async () => {
    await expect(
      useCase.execute({
        ...input,
        productRole: ProductRoleEnum.CANDIDATE,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(updateApplyRepository.readById).not.toHaveBeenCalled();
  });

  it('throws when recruiter company id is missing', async () => {
    updateApplyRepository.readById.mockResolvedValue(existingApply as never);
    readJobRepository.read.mockResolvedValue(existingJob as never);

    await expect(
      useCase.execute({
        ...input,
        recruiterCompanyId: undefined,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(updateApplyRepository.update).not.toHaveBeenCalled();
  });

  it('throws when update returns null', async () => {
    updateApplyRepository.readById.mockResolvedValue(existingApply as never);
    readJobRepository.read.mockResolvedValue(existingJob as never);
    updateApplyRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });
});

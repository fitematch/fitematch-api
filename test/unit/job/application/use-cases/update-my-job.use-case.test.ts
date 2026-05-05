import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { UpdateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-my-job.repository.interface';
import { UpdateMyJobUseCase } from '@src/modules/job/application/use-cases/update-my-job.use-case';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

describe('UpdateMyJobUseCase', () => {
  let useCase: UpdateMyJobUseCase;
  let repository: jest.Mocked<UpdateMyJobRepositoryInterface>;

  const input = {
    userId: 'user-1',
    _id: 'job-1',
    title: 'Professor de Judo Senior',
    description: 'Aulas e acompanhamento tecnico.',
    slots: 2,
    contractType: JobContractTypeEnum.CLT,
  };

  const updatedJob = {
    _id: 'job-1',
    slug: 'professor-de-judo-senior',
    companyId: 'company-1',
    title: 'Professor de Judo Senior',
    description: 'Aulas e acompanhamento tecnico.',
    slots: 2,
    contractType: JobContractTypeEnum.CLT,
    status: JobStatusEnum.ACTIVE,
    createdAt: new Date('2026-04-18T10:00:00.000Z'),
    updatedAt: new Date('2026-04-18T12:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      findRecruiterCompanyId: jest.fn().mockResolvedValue('company-1'),
      update: jest.fn(),
    } as jest.Mocked<UpdateMyJobRepositoryInterface>;

    useCase = new UpdateMyJobUseCase(repository);
  });

  it('updates the recruiter job using the linked company id', async () => {
    repository.update.mockResolvedValue(updatedJob);

    const result = await useCase.execute(input);

    expect(result).toEqual(updatedJob);
    expect(repository.findRecruiterCompanyId).toHaveBeenCalledWith('user-1');
    expect(repository.update).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
    });
  });

  it('throws when recruiter has no linked company', async () => {
    repository.findRecruiterCompanyId.mockResolvedValueOnce(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      ),
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('throws when the job is not found during update', async () => {
    repository.update.mockResolvedValueOnce(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      new NotFoundException('Job not found.'),
    );

    expect(repository.update).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
    });
  });

  it('propagates repository errors', async () => {
    repository.findRecruiterCompanyId.mockRejectedValueOnce(
      new Error('Repository error'),
    );

    await expect(useCase.execute(input)).rejects.toThrow('Repository error');
    expect(repository.update).not.toHaveBeenCalled();
  });
});

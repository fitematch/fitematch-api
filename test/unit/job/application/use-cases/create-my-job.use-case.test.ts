import { BadRequestException, ConflictException } from '@nestjs/common';
import type { CreateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-my-job.repository.interface';
import { CreateMyJobUseCase } from '@src/modules/job/application/use-cases/create-my-job.use-case';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

describe('CreateMyJobUseCase', () => {
  let useCase: CreateMyJobUseCase;
  let repository: jest.Mocked<CreateMyJobRepositoryInterface>;

  beforeEach(() => {
    repository = {
      findRecruiterCompanyId: jest.fn().mockResolvedValue('company-1'),
      findCompanySlugContext: jest.fn().mockResolvedValue({
        tradeName: 'TecFit',
        city: 'Campinas',
        state: 'SP',
      }),
      existsBySlug: jest.fn().mockResolvedValue(false),
      existsDuplicate: jest.fn().mockResolvedValue(false),
      create: jest.fn(),
    } as jest.Mocked<CreateMyJobRepositoryInterface>;

    useCase = new CreateMyJobUseCase(repository);
  });

  it('generates contextual slug when slug is not informed', async () => {
    const input = {
      userId: 'user-1',
      title: 'Professor Judo',
      description: 'Aulas e acompanhamento tecnico.',
      slots: 1,
      contractType: JobContractTypeEnum.CLT,
    };

    repository.create.mockResolvedValue({
      ...input,
      _id: 'job-1',
      companyId: 'company-1',
      slug: 'professor-judo-tecfit-campinas-sp',
      status: JobStatusEnum.PENDING,
    });

    await useCase.execute(input);

    expect(repository.findRecruiterCompanyId).toHaveBeenCalledWith(
      'user-1',
      undefined,
    );
    expect(repository.findCompanySlugContext).toHaveBeenCalledWith('company-1');
    expect(repository.create).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
      slug: 'professor-judo-tecfit-campinas-sp',
      status: JobStatusEnum.PENDING,
    });
  });

  it('throws when recruiter has no linked company', async () => {
    repository.findRecruiterCompanyId.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        title: 'Professor Judo',
        description: 'Aulas e acompanhamento tecnico.',
        slots: 1,
        contractType: JobContractTypeEnum.CLT,
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      ),
    );
  });

  it('uses company found by creator fallback when profile companyId is missing', async () => {
    const input = {
      userId: 'user-1',
      companyId: 'company-from-audit',
      title: 'Professor Judo',
      description: 'Aulas e acompanhamento tecnico.',
      slots: 1,
      contractType: JobContractTypeEnum.CLT,
    };

    repository.findRecruiterCompanyId.mockResolvedValueOnce(
      'company-from-audit',
    );
    repository.findCompanySlugContext.mockResolvedValueOnce({
      tradeName: 'Smart Fit',
      city: 'Sao Paulo',
      state: 'SP',
    });
    repository.create.mockResolvedValue({
      ...input,
      _id: 'job-2',
      companyId: 'company-from-audit',
      slug: 'professor-judo-smart-fit-sao-paulo-sp',
      status: JobStatusEnum.PENDING,
    });

    await useCase.execute(input);

    expect(repository.findRecruiterCompanyId).toHaveBeenCalledWith(
      'user-1',
      'company-from-audit',
    );
    expect(repository.create).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-from-audit',
      slug: 'professor-judo-smart-fit-sao-paulo-sp',
      status: JobStatusEnum.PENDING,
    });
  });

  it('throws conflict when duplicate active or pending job exists', async () => {
    repository.existsDuplicate.mockResolvedValueOnce(true);

    await expect(
      useCase.execute({
        userId: 'user-1',
        title: 'Professor Judo',
        description: 'Aulas e acompanhamento tecnico.',
        slots: 1,
        contractType: JobContractTypeEnum.CLT,
      }),
    ).rejects.toThrow(
      new ConflictException(
        'A job with the same title already exists for this company.',
      ),
    );
  });
});

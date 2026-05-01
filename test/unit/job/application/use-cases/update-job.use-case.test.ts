import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { UpdateJobUseCase } from '@src/modules/job/application/use-cases/update-job.use-case';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';

describe('UpdateJobUseCase', () => {
  let useCase: UpdateJobUseCase;
  let updateJobRepository: jest.Mocked<UpdateJobRepositoryInterface>;

  const input = {
    _id: 'job-id-1',
    productRole: ProductRoleEnum.RECRUITER,
    recruiterCompanyId: 'company-id-1',
    companyId: 'company-id-1',
    title: 'Senior Personal Trainer',
    description: 'Responsible for premium clients and training plans.',
    slots: 2,
    contractType: JobContractTypeEnum.CLT,
    requirements: {
      educationLevel: [
        EducationLevelEnum.BACHELOR,
        EducationLevelEnum.POSTGRADUATE,
      ],
      minExperienceYears: 3,
      maxExperienceYears: 8,
      languages: [
        {
          name: LanguagesEnum.PORTUGUESE,
          level: LanguagesLevelEnum.NATIVE,
        },
        {
          name: LanguagesEnum.ENGLISH,
          level: LanguagesLevelEnum.ADVANCED,
        },
      ],
      hardSkills: {
        required: [
          HardSkillsEnum.EXERCISE_PRESCRIPTION,
          HardSkillsEnum.TRAINING_PERIODIZATION,
        ],
        niceToHave: [HardSkillsEnum.FITNESS_SOFTWARE],
      },
      softSkills: {
        required: [SoftSkillsEnum.COMMUNICATION, SoftSkillsEnum.LEADERSHIP],
        niceToHave: [SoftSkillsEnum.PROBLEM_SOLVING],
      },
    },
    benefits: {
      salary: 6500,
      healthInsurance: true,
      dentalInsurance: true,
      alimentationVoucher: true,
      transportationVoucher: true,
    },
    status: JobStatusEnum.ACTIVE,
  };

  const existingJob = {
    _id: 'job-id-1',
    slug: 'senior-personal-trainer',
    companyId: 'company-id-1',
    title: 'Senior Personal Trainer',
    description: 'Responsible for premium clients and training plans.',
    slots: 2,
    contractType: JobContractTypeEnum.CLT,
    requirements: input.requirements,
    benefits: input.benefits,
    status: JobStatusEnum.ACTIVE,
    createdAt: new Date('2026-04-18T10:00:00.000Z'),
    updatedAt: new Date('2026-04-18T11:00:00.000Z'),
  };

  const updatedJob = {
    ...existingJob,
    updatedAt: new Date('2026-04-18T12:00:00.000Z'),
  };

  beforeEach(() => {
    updateJobRepository = {
      readById: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<UpdateJobRepositoryInterface>;

    useCase = new UpdateJobUseCase(updateJobRepository);
  });

  it('returns the updated job when recruiter owns it', async () => {
    updateJobRepository.readById.mockResolvedValue(existingJob as never);
    updateJobRepository.update.mockResolvedValue(updatedJob);

    const result = await useCase.execute(input);

    expect(result).toEqual(updatedJob);
    expect(updateJobRepository.readById).toHaveBeenCalledWith('job-id-1');
    expect(updateJobRepository.update).toHaveBeenCalledWith(input);
  });

  it('throws when product role is not recruiter', async () => {
    await expect(
      useCase.execute({
        ...input,
        productRole: ProductRoleEnum.CANDIDATE,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(updateJobRepository.readById).not.toHaveBeenCalled();
  });

  it('throws when the job does not exist before update', async () => {
    updateJobRepository.readById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    expect(updateJobRepository.update).not.toHaveBeenCalled();
  });

  it('throws when recruiter does not own the job', async () => {
    updateJobRepository.readById.mockResolvedValue({
      ...existingJob,
      companyId: 'other-company-id',
    } as never);

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
    expect(updateJobRepository.update).not.toHaveBeenCalled();
  });

  it('throws when update returns null', async () => {
    updateJobRepository.readById.mockResolvedValue(existingJob as never);
    updateJobRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });
});

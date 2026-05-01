import { ConflictException } from '@nestjs/common';
import { CreateJobUseCase } from '@src/modules/job/application/use-cases/create-job.use-case';
import type { CreateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-job.repository.interface';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

describe('CreateJobUseCase', () => {
  let useCase: CreateJobUseCase;
  let createJobRepository: jest.Mocked<CreateJobRepositoryInterface>;

  beforeEach(() => {
    createJobRepository = {
      existsBySlug: jest.fn().mockResolvedValue(false),
      existsDuplicate: jest.fn().mockResolvedValue(false),
      create: jest.fn(),
    } as jest.Mocked<CreateJobRepositoryInterface>;

    useCase = new CreateJobUseCase(createJobRepository);
  });

  describe('execute', () => {
    describe('when status is not provided', () => {
      it('should create a job with pending status by default', async () => {
        const input = {
          slug: 'personal-trainer-senior',
          companyId: 'company-1',
          title: 'Personal Trainer',
          description: 'Responsible for training and monitoring gym clients.',
          slots: 2,
          contractType: JobContractTypeEnum.CLT,
          requirements: {
            educationLevel: [EducationLevelEnum.BACHELOR],
            minExperienceYears: 2,
            maxExperienceYears: 5,
            languages: [
              {
                name: LanguagesEnum.PORTUGUESE,
                level: LanguagesLevelEnum.NATIVE,
              },
            ],
            hardSkills: {
              required: [
                HardSkillsEnum.EXERCISE_PRESCRIPTION,
                HardSkillsEnum.STRENGTH_TRAINING,
              ],
              niceToHave: [HardSkillsEnum.BODY_COMPOSITION_ASSESSMENT],
            },
            softSkills: {
              required: [
                SoftSkillsEnum.COMMUNICATION,
                SoftSkillsEnum.MOTIVATION,
              ],
              niceToHave: [SoftSkillsEnum.LEADERSHIP],
            },
          },
          benefits: {
            salary: 3500,
            healthInsurance: true,
            dentalInsurance: true,
            alimentationVoucher: true,
            transportationVoucher: true,
          },
        };

        const expected = {
          ...input,
          _id: 'job-1',
          status: JobStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createJobRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createJobRepository.existsDuplicate).toHaveBeenCalledWith(
          input.companyId,
          input.title,
          [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
        );
        expect(createJobRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'personal-trainer-senior',
          status: JobStatusEnum.PENDING,
        });
        expect(createJobRepository.create).toHaveBeenCalledTimes(1);
      });

      it('should generate the slug from title when the informed slug is empty', async () => {
        const input = {
          slug: '',
          companyId: 'company-1',
          title: 'Personal Trainer Senior',
          description: 'Responsible for training and monitoring gym clients.',
          slots: 2,
          contractType: JobContractTypeEnum.CLT,
        };

        const expected = {
          ...input,
          _id: 'job-3',
          slug: 'personal-trainer-senior',
          status: JobStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createJobRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createJobRepository.existsDuplicate).toHaveBeenCalledWith(
          input.companyId,
          input.title,
          [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
        );
        expect(createJobRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'personal-trainer-senior',
          status: JobStatusEnum.PENDING,
        });
      });

      it('should append a numeric suffix when the generated slug already exists', async () => {
        const input = {
          companyId: 'company-1',
          title: 'Personal Trainer Senior',
          description: 'Responsible for training and monitoring gym clients.',
          slots: 2,
          contractType: JobContractTypeEnum.CLT,
        };

        const expected = {
          ...input,
          _id: 'job-4',
          slug: 'personal-trainer-senior-1',
          status: JobStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createJobRepository.existsBySlug
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false);
        createJobRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createJobRepository.existsDuplicate).toHaveBeenCalledWith(
          input.companyId,
          input.title,
          [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
        );
        expect(createJobRepository.existsBySlug).toHaveBeenNthCalledWith(
          1,
          'personal-trainer-senior',
        );
        expect(createJobRepository.existsBySlug).toHaveBeenNthCalledWith(
          2,
          'personal-trainer-senior-1',
        );
        expect(createJobRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'personal-trainer-senior-1',
          status: JobStatusEnum.PENDING,
        });
      });
    });

    describe('when status is provided', () => {
      it('should use the informed status', async () => {
        const input = {
          slug: 'fitness-coordinator',
          companyId: 'company-2',
          title: 'Fitness Coordinator',
          description: 'Coordinates training planning and gym floor team.',
          slots: 1,
          contractType: JobContractTypeEnum.PJ,
          requirements: {
            educationLevel: [
              EducationLevelEnum.BACHELOR,
              EducationLevelEnum.POSTGRADUATE,
            ],
            minExperienceYears: 4,
            maxExperienceYears: 8,
            languages: [
              {
                name: LanguagesEnum.PORTUGUESE,
                level: LanguagesLevelEnum.NATIVE,
              },
              {
                name: LanguagesEnum.ENGLISH,
                level: LanguagesLevelEnum.INTERMEDIATE,
              },
            ],
            hardSkills: {
              required: [
                HardSkillsEnum.TRAINING_PERIODIZATION,
                HardSkillsEnum.FUNCTIONAL_TRAINING,
              ],
              niceToHave: [HardSkillsEnum.FITNESS_SOFTWARE],
            },
            softSkills: {
              required: [
                SoftSkillsEnum.LEADERSHIP,
                SoftSkillsEnum.ORGANIZATION,
              ],
              niceToHave: [SoftSkillsEnum.PROBLEM_SOLVING],
            },
          },
          benefits: {
            salary: 5200,
            healthInsurance: true,
            dentalInsurance: true,
            alimentationVoucher: true,
            transportationVoucher: true,
          },
          status: JobStatusEnum.ACTIVE,
        };

        const expected = {
          ...input,
          _id: 'job-2',
          createdAt: new Date('2024-02-01T00:00:00.000Z'),
          updatedAt: new Date('2024-02-02T00:00:00.000Z'),
        };

        createJobRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createJobRepository.existsDuplicate).toHaveBeenCalledWith(
          input.companyId,
          input.title,
          [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
        );
        expect(createJobRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'fitness-coordinator',
        });
        expect(createJobRepository.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('when a duplicate active or pending job exists', () => {
      it('should throw a conflict exception', async () => {
        const input = {
          companyId: 'company-1',
          title: '  Personal Trainer Senior  ',
          description: 'Responsible for training and monitoring gym clients.',
          slots: 2,
          contractType: JobContractTypeEnum.CLT,
        };

        createJobRepository.existsDuplicate.mockResolvedValue(true);

        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException(
            'A job with the same title already exists for this company.',
          ),
        );
        expect(createJobRepository.existsDuplicate).toHaveBeenCalledWith(
          input.companyId,
          input.title,
          [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
        );
        expect(createJobRepository.existsBySlug).not.toHaveBeenCalled();
        expect(createJobRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          slug: 'error-job',
          companyId: 'company-3',
          title: 'Error Job',
          description: 'Invalid job for error scenario.',
          slots: 1,
          contractType: JobContractTypeEnum.CLT,
        };
        const errorMessage = 'Repository error';

        createJobRepository.create.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(createJobRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'error-job',
          status: JobStatusEnum.PENDING,
        });
        expect(createJobRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});

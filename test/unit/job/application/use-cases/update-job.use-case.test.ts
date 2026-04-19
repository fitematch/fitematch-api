import { UpdateJobUseCase } from '@src/modules/job/application/use-cases/update-job.use-case';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

describe('UpdateJobUseCase', () => {
  let useCase: UpdateJobUseCase;
  let updateJobRepository: jest.Mocked<UpdateJobRepositoryInterface>;

  beforeEach(() => {
    updateJobRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateJobRepositoryInterface>;

    useCase = new UpdateJobUseCase(updateJobRepository);
  });

  describe('execute', () => {
    describe('when the job exists', () => {
      it('should return the updated job with all fields', async () => {
        const input = {
          id: 'job-id-1',
          companyId: 'company-id-1',
          title: 'Senior Personal Trainer',
          description: 'Responsible for premium clients and training plans.',
          slots: 2,
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
              required: [
                SoftSkillsEnum.COMMUNICATION,
                SoftSkillsEnum.LEADERSHIP,
              ],
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

        const output = {
          ...input,
          slug: 'senior-personal-trainer',
          createdAt: new Date('2026-04-18T10:00:00.000Z'),
          updatedAt: new Date('2026-04-18T11:00:00.000Z'),
        };

        updateJobRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateJobRepository.update).toHaveBeenCalledWith(input);
        expect(updateJobRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the job does not exist', () => {
      it('should return null', async () => {
        const input = {
          id: 'missing-job-id',
          title: 'Missing Job',
        };

        updateJobRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateJobRepository.update).toHaveBeenCalledWith(input);
        expect(updateJobRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          id: 'error-job-id',
          title: 'Error Job',
        };
        const errorMessage = 'Repository error';

        updateJobRepository.update.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(updateJobRepository.update).toHaveBeenCalledWith(input);
        expect(updateJobRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

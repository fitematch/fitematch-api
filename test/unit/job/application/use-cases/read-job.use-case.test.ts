import { ReadJobUseCase } from '@src/modules/job/application/use-cases/read-job.use-case';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

describe('ReadJobUseCase', () => {
  let useCase: ReadJobUseCase;
  let readJobRepository: jest.Mocked<ReadJobRepositoryInterface>;

  beforeEach(() => {
    readJobRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadJobRepositoryInterface>;

    useCase = new ReadJobUseCase(readJobRepository);
  });

  describe('execute', () => {
    describe('when the job exists', () => {
      it('should return the job with all mapped fields', async () => {
        const input = { id: 'job-id-1' };

        const output = {
          id: 'job-id-1',
          companyId: 'company-1',
          title: 'Personal Trainer Senior',
          description:
            'Profissional responsavel por avaliacao fisica, prescricao de treinos e acompanhamento de alunos.',
          slots: 2,
          requirements: {
            educationLevel: [
              EducationLevelEnum.BACHELOR,
              EducationLevelEnum.POSTGRADUATE,
            ],
            minExperienceYears: 2,
            maxExperienceYears: 6,
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
                HardSkillsEnum.CPR,
                HardSkillsEnum.EXERCISE_PRESCRIPTION,
              ],
              niceToHave: [HardSkillsEnum.HIIT],
            },
            softSkills: {
              required: [SoftSkillsEnum.EMPATHY, SoftSkillsEnum.MOTIVATION],
              niceToHave: [
                SoftSkillsEnum.LEADERSHIP,
                SoftSkillsEnum.PROACTIVITY,
              ],
            },
          },
          benefits: {
            salary: 4500,
            healthInsurance: true,
            dentalInsurance: true,
            alimentationVoucher: true,
            transportationVoucher: true,
          },
          status: JobStatusEnum.PENDING,
          createdAt: new Date('2026-04-18T04:24:41.570Z'),
          updatedAt: new Date('2026-04-18T05:24:41.570Z'),
        };

        readJobRepository.read.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(readJobRepository.read).toHaveBeenCalledWith(input);
        expect(readJobRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the job does not exist', () => {
      it('should return null', async () => {
        const input = { id: 'missing-job-id' };

        readJobRepository.read.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(readJobRepository.read).toHaveBeenCalledWith(input);
        expect(readJobRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { id: 'error-job-id' };
        const errorMessage = 'Repository error';

        readJobRepository.read.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(readJobRepository.read).toHaveBeenCalledWith(input);
        expect(readJobRepository.read).toHaveBeenCalledTimes(1);
      });
    });
  });
});

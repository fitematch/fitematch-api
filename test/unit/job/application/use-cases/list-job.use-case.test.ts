import { ListJobUseCase } from '@src/modules/job/application/use-cases/list-job.use-case';
import type { ListJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/list-job.repository.interface';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

describe('ListJobUseCase', () => {
  let useCase: ListJobUseCase;
  let listJobRepository: jest.Mocked<ListJobRepositoryInterface>;

  beforeEach(() => {
    listJobRepository = {
      list: jest.fn(),
    } as jest.Mocked<ListJobRepositoryInterface>;

    useCase = new ListJobUseCase(listJobRepository);
  });

  describe('execute', () => {
    describe('when jobs are found', () => {
      it('should return a list of jobs', async () => {
        const input = {
          search: 'personal trainer',
          page: 1,
          limit: 10,
          status: JobStatusEnum.ACTIVE,
          companyId: 'company-1',
        };

        const jobs = [
          {
            id: 'job-1',
            companyId: 'company-1',
            title: 'Personal Trainer',
            description: 'Responsible for training and monitoring gym clients.',
            slots: 2,
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
            status: JobStatusEnum.ACTIVE,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
          },
          {
            id: 'job-2',
            companyId: 'company-1',
            title: 'Group Class Instructor',
            description: 'Leads collective functional and HIIT classes.',
            slots: 1,
            requirements: {
              educationLevel: [EducationLevelEnum.TECHNICAL],
              minExperienceYears: 1,
              languages: [
                {
                  name: LanguagesEnum.ENGLISH,
                  level: LanguagesLevelEnum.BASIC,
                },
              ],
              hardSkills: {
                required: [HardSkillsEnum.GROUP_CLASSES, HardSkillsEnum.HIIT],
              },
              softSkills: {
                required: [SoftSkillsEnum.COMMUNICATION],
              },
            },
            benefits: {
              salary: 2800,
              transportationVoucher: true,
            },
            status: JobStatusEnum.PENDING,
            createdAt: new Date('2024-02-01T00:00:00.000Z'),
            updatedAt: new Date('2024-02-03T00:00:00.000Z'),
          },
        ];

        listJobRepository.list.mockResolvedValue(jobs);

        const result = await useCase.execute(input);

        expect(result).toEqual(jobs);
        expect(listJobRepository.list).toHaveBeenCalledWith(input);
        expect(listJobRepository.list).toHaveBeenCalledTimes(1);
      });

      it('should map all job fields from repository output', async () => {
        const input = { page: 2, limit: 1 };

        const createdAt = new Date('2024-03-01T00:00:00.000Z');
        const updatedAt = new Date('2024-03-05T00:00:00.000Z');

        listJobRepository.list.mockResolvedValue([
          {
            id: 'job-3',
            companyId: 'company-2',
            title: 'Fitness Coordinator',
            description: 'Coordinates training planning and gym floor team.',
            slots: 1,
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
                  HardSkillsEnum.PERSONAL_TRAINING,
                ],
                niceToHave: [
                  HardSkillsEnum.FITNESS_SOFTWARE,
                  HardSkillsEnum.FIRST_AID,
                ],
              },
              softSkills: {
                required: [
                  SoftSkillsEnum.LEADERSHIP,
                  SoftSkillsEnum.ORGANIZATION,
                  SoftSkillsEnum.CUSTOMER_SERVICE,
                ],
                niceToHave: [
                  SoftSkillsEnum.PROBLEM_SOLVING,
                  SoftSkillsEnum.ADAPTABILITY,
                ],
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
            createdAt,
            updatedAt,
          },
        ]);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            id: 'job-3',
            companyId: 'company-2',
            title: 'Fitness Coordinator',
            description: 'Coordinates training planning and gym floor team.',
            slots: 1,
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
                  HardSkillsEnum.PERSONAL_TRAINING,
                ],
                niceToHave: [
                  HardSkillsEnum.FITNESS_SOFTWARE,
                  HardSkillsEnum.FIRST_AID,
                ],
              },
              softSkills: {
                required: [
                  SoftSkillsEnum.LEADERSHIP,
                  SoftSkillsEnum.ORGANIZATION,
                  SoftSkillsEnum.CUSTOMER_SERVICE,
                ],
                niceToHave: [
                  SoftSkillsEnum.PROBLEM_SOLVING,
                  SoftSkillsEnum.ADAPTABILITY,
                ],
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
            createdAt,
            updatedAt,
          },
        ]);
      });
    });

    describe('when no jobs are found', () => {
      it('should return an empty array', async () => {
        const input = { search: 'missing-job' };

        listJobRepository.list.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual([]);
        expect(listJobRepository.list).toHaveBeenCalledWith(input);
        expect(listJobRepository.list).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { search: 'error-job' };
        const errorMessage = 'Repository error';

        listJobRepository.list.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(listJobRepository.list).toHaveBeenCalledWith(input);
        expect(listJobRepository.list).toHaveBeenCalledTimes(1);
      });
    });
  });
});

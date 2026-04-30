import { ListJobUseCase } from '@src/modules/job/application/use-cases/list-job.use-case';
import type { ListJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/list-job.repository.interface';
import type { ListJobCompaniesRepository } from '@src/modules/job/application/contracts/repositories/list-job-companies.repository';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

describe('ListJobUseCase', () => {
  let useCase: ListJobUseCase;
  let listJobRepository: jest.Mocked<ListJobRepositoryInterface>;
  let listJobCompaniesRepository: jest.Mocked<ListJobCompaniesRepository>;

  beforeEach(() => {
    listJobRepository = {
      list: jest.fn(),
    } as jest.Mocked<ListJobRepositoryInterface>;

    listJobCompaniesRepository = {
      findByIds: jest.fn(),
    } as jest.Mocked<ListJobCompaniesRepository>;

    useCase = new ListJobUseCase(listJobRepository, listJobCompaniesRepository);
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
            _id: 'job-1',
            slug: 'personal-trainer-senior',
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
            _id: 'job-2',
            slug: 'group-class-instructor',
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
        listJobCompaniesRepository.findByIds.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual(
          jobs.map((job) => ({
            ...job,
            company: undefined,
          })),
        );
        expect(listJobRepository.list).toHaveBeenCalledWith(input);
        expect(listJobRepository.list).toHaveBeenCalledTimes(1);
        expect(listJobCompaniesRepository.findByIds).toHaveBeenCalledWith([
          'company-1',
        ]);
      });

      it('should map all job fields from repository output', async () => {
        const input = { page: 2, limit: 1 };

        const createdAt = new Date('2024-03-01T00:00:00.000Z');
        const updatedAt = new Date('2024-03-05T00:00:00.000Z');

        listJobRepository.list.mockResolvedValue([
          {
            _id: 'job-3',
            slug: 'fitness-coordinator',
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
        listJobCompaniesRepository.findByIds.mockResolvedValue([
          {
            _id: 'company-2',
            slug: 'fit-co',
            tradeName: 'Fit Co',
            legalName: 'Fit Co Ltda',
            contacts: {
              email: 'jobs@fitco.com',
              website: 'https://fitco.com',
              address: {
                street: 'Rua A',
                number: '10',
                complement: 'Sala 2',
                neighborhood: 'Centro',
                city: 'Sao Paulo',
                state: 'SP',
                country: 'Brasil',
                zipCode: '01001000',
              },
            },
            documents: {},
            media: {
              logoUrl: 'https://cdn.example.com/fitco.png',
            },
            audit: {},
            approval: {},
            status: 'ACTIVE' as never,
            createdAt,
            updatedAt,
          } as never,
        ]);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            _id: 'job-3',
            slug: 'fitness-coordinator',
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
            company: {
              id: 'company-2',
              tradeName: 'Fit Co',
              contacts: {
                email: 'jobs@fitco.com',
                website: 'https://fitco.com',
                address: {
                  street: 'Rua A',
                  number: '10',
                  complement: 'Sala 2',
                  neighborhood: 'Centro',
                  city: 'Sao Paulo',
                  state: 'SP',
                  country: 'Brasil',
                  zipCode: '01001000',
                },
              },
              media: {
                logoUrl: 'https://cdn.example.com/fitco.png',
              },
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
        listJobCompaniesRepository.findByIds.mockResolvedValue([]);

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

import { BadRequestException } from '@nestjs/common';
import { ListMyJobsUseCase } from '@src/modules/job/application/use-cases/list-my-jobs.use-case';
import type { ListMyJobsRepository } from '@src/modules/job/application/contracts/repositories/list-my-jobs.repository';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';

describe('ListMyJobsUseCase', () => {
  let useCase: ListMyJobsUseCase;
  let listMyJobsRepository: jest.Mocked<ListMyJobsRepository>;

  beforeEach(() => {
    listMyJobsRepository = {
      findByCompanyId: jest.fn(),
    } as jest.Mocked<ListMyJobsRepository>;

    useCase = new ListMyJobsUseCase(listMyJobsRepository);
  });

  describe('execute', () => {
    describe('when recruiter has no company linked', () => {
      it('should throw a bad request exception', async () => {
        await expect(useCase.execute({ companyId: '' })).rejects.toThrow(
          new BadRequestException(
            'Recruiter does not have a company linked to profile.',
          ),
        );
        expect(listMyJobsRepository.findByCompanyId).not.toHaveBeenCalled();
      });
    });

    describe('when jobs are found', () => {
      it('should return the mapped list of recruiter jobs', async () => {
        const input = {
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
              },
              softSkills: {
                required: [SoftSkillsEnum.COMMUNICATION],
              },
            },
            benefits: {
              salary: 3500,
              healthInsurance: true,
              dentalInsurance: true,
              alimentationVoucher: true,
              transportationVoucher: true,
            },
            media: {
              coverUrl: 'https://cdn.example.com/job-1-cover.png',
            },
            contractType: JobContractTypeEnum.CLT,
            status: JobStatusEnum.ACTIVE,
            createdAt: new Date('2026-04-28T10:00:00.000Z'),
            updatedAt: new Date('2026-04-28T10:30:00.000Z'),
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
                required: [SoftSkillsEnum.MOTIVATION],
              },
            },
            benefits: {
              salary: 2800,
              transportationVoucher: true,
            },
            media: {},
            contractType: JobContractTypeEnum.PJ,
            status: JobStatusEnum.PENDING,
            createdAt: new Date('2026-04-28T11:00:00.000Z'),
            updatedAt: new Date('2026-04-28T11:20:00.000Z'),
          },
        ];

        listMyJobsRepository.findByCompanyId.mockResolvedValue(jobs);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            id: 'job-1',
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
              },
              softSkills: {
                required: [SoftSkillsEnum.COMMUNICATION],
              },
            },
            benefits: {
              salary: 3500,
              healthInsurance: true,
              dentalInsurance: true,
              alimentationVoucher: true,
              transportationVoucher: true,
            },
            media: {
              coverUrl: 'https://cdn.example.com/job-1-cover.png',
            },
            status: JobStatusEnum.ACTIVE,
            createdAt: new Date('2026-04-28T10:00:00.000Z'),
            updatedAt: new Date('2026-04-28T10:30:00.000Z'),
          },
          {
            id: 'job-2',
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
                required: [SoftSkillsEnum.MOTIVATION],
              },
            },
            benefits: {
              salary: 2800,
              transportationVoucher: true,
            },
            media: {},
            status: JobStatusEnum.PENDING,
            createdAt: new Date('2026-04-28T11:00:00.000Z'),
            updatedAt: new Date('2026-04-28T11:20:00.000Z'),
          },
        ]);
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledWith(
          input.companyId,
        );
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when no jobs are found', () => {
      it('should return an empty array', async () => {
        const input = {
          companyId: 'missing-company-id',
        };

        listMyJobsRepository.findByCompanyId.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual([]);
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledWith(
          input.companyId,
        );
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          companyId: 'company-id-error',
        };
        const error = new Error('Repository error');

        listMyJobsRepository.findByCompanyId.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledWith(
          input.companyId,
        );
        expect(listMyJobsRepository.findByCompanyId).toHaveBeenCalledTimes(1);
      });
    });
  });
});

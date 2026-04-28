import { BadRequestException } from '@nestjs/common';
import { ListAppliesByJobUseCase } from '@src/modules/apply/application/use-cases/list-applies-by-job.use-case';
import type { ListAppliesByJobRepository } from '@src/modules/apply/application/contracts/repositories/list-applies-by-job.repository';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('ListAppliesByJobUseCase', () => {
  let useCase: ListAppliesByJobUseCase;
  let listAppliesByJobRepository: jest.Mocked<ListAppliesByJobRepository>;

  beforeEach(() => {
    listAppliesByJobRepository = {
      findByJobId: jest.fn(),
    } as jest.Mocked<ListAppliesByJobRepository>;

    useCase = new ListAppliesByJobUseCase(listAppliesByJobRepository);
  });

  describe('execute', () => {
    describe('when jobId is not provided', () => {
      it('should throw a bad request exception', async () => {
        await expect(useCase.execute({ jobId: '' })).rejects.toThrow(
          new BadRequestException('Job id is required.'),
        );
        expect(listAppliesByJobRepository.findByJobId).not.toHaveBeenCalled();
      });
    });

    describe('when applications are found for the job', () => {
      it('should return the mapped list of applications', async () => {
        const input = {
          jobId: 'job-id-1',
        };

        const applies = [
          {
            _id: 'apply-id-1',
            jobId: 'job-id-1',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.APPLIED,
            createdAt: new Date('2026-04-28T12:00:00.000Z'),
            updatedAt: new Date('2026-04-28T12:20:00.000Z'),
          },
          {
            _id: 'apply-id-2',
            jobId: 'job-id-1',
            userId: 'user-id-2',
            status: ApplicationStatusEnum.HIRED,
            createdAt: new Date('2026-04-28T13:00:00.000Z'),
            updatedAt: new Date('2026-04-28T13:10:00.000Z'),
          },
        ];

        listAppliesByJobRepository.findByJobId.mockResolvedValue(applies);

        const result = await useCase.execute(input);

        expect(result).toEqual([
          {
            id: 'apply-id-1',
            jobId: 'job-id-1',
            userId: 'user-id-1',
            status: ApplicationStatusEnum.APPLIED,
            createdAt: new Date('2026-04-28T12:00:00.000Z'),
            updatedAt: new Date('2026-04-28T12:20:00.000Z'),
          },
          {
            id: 'apply-id-2',
            jobId: 'job-id-1',
            userId: 'user-id-2',
            status: ApplicationStatusEnum.HIRED,
            createdAt: new Date('2026-04-28T13:00:00.000Z'),
            updatedAt: new Date('2026-04-28T13:10:00.000Z'),
          },
        ]);
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledWith(
          input.jobId,
        );
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when no applications are found for the job', () => {
      it('should return an empty list', async () => {
        const input = {
          jobId: 'missing-job-id',
        };

        listAppliesByJobRepository.findByJobId.mockResolvedValue([]);

        const result = await useCase.execute(input);

        expect(result).toEqual([]);
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledWith(
          input.jobId,
        );
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          jobId: 'job-id-error',
        };
        const error = new Error('Repository error');

        listAppliesByJobRepository.findByJobId.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledWith(
          input.jobId,
        );
        expect(listAppliesByJobRepository.findByJobId).toHaveBeenCalledTimes(1);
      });
    });
  });
});

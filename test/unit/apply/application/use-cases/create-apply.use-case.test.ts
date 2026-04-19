import { ConflictException } from '@nestjs/common';
import { CreateApplyUseCase } from '@src/modules/apply/application/use-cases/create-apply.use-case';
import type { CreateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/create-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('CreateApplyUseCase', () => {
  let useCase: CreateApplyUseCase;
  let createApplyRepository: jest.Mocked<CreateApplyRepositoryInterface>;

  beforeEach(() => {
    createApplyRepository = {
      existsByJobIdAndUserId: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<CreateApplyRepositoryInterface>;

    useCase = new CreateApplyUseCase(createApplyRepository);
  });

  describe('execute', () => {
    describe('when the user has not applied yet and status is not provided', () => {
      it('should create an application with applied status by default', async () => {
        const input = {
          jobId: 'job-id-1',
          userId: 'user-id-1',
        };

        const output = {
          id: 'apply-id-1',
          ...input,
          status: ApplicationStatusEnum.APPLIED,
          createdAt: new Date('2026-04-19T10:00:00.000Z'),
          updatedAt: new Date('2026-04-19T10:00:00.000Z'),
        };

        createApplyRepository.existsByJobIdAndUserId.mockResolvedValue(false);
        createApplyRepository.create.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledWith(input.jobId, input.userId);
        expect(createApplyRepository.create).toHaveBeenCalledWith({
          ...input,
          status: ApplicationStatusEnum.APPLIED,
        });
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledTimes(1);
        expect(createApplyRepository.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the user has not applied yet and status is provided', () => {
      it('should create an application with the informed status', async () => {
        const input = {
          jobId: 'job-id-2',
          userId: 'user-id-2',
          status: ApplicationStatusEnum.SHORTLISTED,
        };

        const output = {
          id: 'apply-id-2',
          ...input,
          createdAt: new Date('2026-04-19T11:00:00.000Z'),
          updatedAt: new Date('2026-04-19T11:30:00.000Z'),
        };

        createApplyRepository.existsByJobIdAndUserId.mockResolvedValue(false);
        createApplyRepository.create.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledWith(input.jobId, input.userId);
        expect(createApplyRepository.create).toHaveBeenCalledWith(input);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledTimes(1);
        expect(createApplyRepository.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the user has already applied to the job', () => {
      it('should throw a conflict exception', async () => {
        const input = {
          jobId: 'job-id-3',
          userId: 'user-id-3',
        };

        createApplyRepository.existsByJobIdAndUserId.mockResolvedValue(true);

        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException('User already applied to this job.'),
        );
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledWith(input.jobId, input.userId);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledTimes(1);
        expect(createApplyRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error from exists check', async () => {
        const input = {
          jobId: 'job-id-4',
          userId: 'user-id-4',
        };
        const error = new Error('Repository error');

        createApplyRepository.existsByJobIdAndUserId.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledWith(input.jobId, input.userId);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledTimes(1);
        expect(createApplyRepository.create).not.toHaveBeenCalled();
      });

      it('should propagate the error from create', async () => {
        const input = {
          jobId: 'job-id-5',
          userId: 'user-id-5',
        };
        const error = new Error('Repository error');

        createApplyRepository.existsByJobIdAndUserId.mockResolvedValue(false);
        createApplyRepository.create.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledWith(input.jobId, input.userId);
        expect(createApplyRepository.create).toHaveBeenCalledWith({
          ...input,
          status: ApplicationStatusEnum.APPLIED,
        });
        expect(
          createApplyRepository.existsByJobIdAndUserId,
        ).toHaveBeenCalledTimes(1);
        expect(createApplyRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});

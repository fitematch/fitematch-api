import { UpdateApplyUseCase } from '@src/modules/apply/application/use-cases/update-apply.use-case';
import type { UpdateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/update-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('UpdateApplyUseCase', () => {
  let useCase: UpdateApplyUseCase;
  let updateApplyRepository: jest.Mocked<UpdateApplyRepositoryInterface>;

  beforeEach(() => {
    updateApplyRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateApplyRepositoryInterface>;

    useCase = new UpdateApplyUseCase(updateApplyRepository);
  });

  describe('execute', () => {
    describe('when the application exists', () => {
      it('should return the updated application with all fields', async () => {
        const input = {
          id: 'apply-id-1',
          status: ApplicationStatusEnum.SHORTLISTED,
        };

        const output = {
          ...input,
          jobId: 'job-id-1',
          userId: 'user-id-1',
          createdAt: new Date('2026-04-19T14:00:00.000Z'),
          updatedAt: new Date('2026-04-19T14:30:00.000Z'),
        };

        updateApplyRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateApplyRepository.update).toHaveBeenCalledWith(input);
        expect(updateApplyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the application does not exist', () => {
      it('should return null', async () => {
        const input = {
          id: 'missing-apply-id',
          status: ApplicationStatusEnum.REJECTED,
        };

        updateApplyRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateApplyRepository.update).toHaveBeenCalledWith(input);
        expect(updateApplyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          id: 'error-apply-id',
          status: ApplicationStatusEnum.HIRED,
        };
        const errorMessage = 'Repository error';

        updateApplyRepository.update.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(updateApplyRepository.update).toHaveBeenCalledWith(input);
        expect(updateApplyRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

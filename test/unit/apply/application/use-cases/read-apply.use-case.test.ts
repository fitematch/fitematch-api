import { ReadApplyUseCase } from '@src/modules/apply/application/use-cases/read-apply.use-case';
import type { ReadApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/read-apply.repository.interface';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

describe('ReadApplyUseCase', () => {
  let useCase: ReadApplyUseCase;
  let readApplyRepository: jest.Mocked<ReadApplyRepositoryInterface>;

  beforeEach(() => {
    readApplyRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadApplyRepositoryInterface>;

    useCase = new ReadApplyUseCase(readApplyRepository);
  });

  describe('execute', () => {
    describe('when the application exists', () => {
      it('should return the application with all mapped fields', async () => {
        const input = { id: 'apply-id-1' };

        const output = {
          id: 'apply-id-1',
          jobId: 'job-id-1',
          userId: 'user-id-1',
          status: ApplicationStatusEnum.APPLIED,
          createdAt: new Date('2026-04-19T13:00:00.000Z'),
          updatedAt: new Date('2026-04-19T13:30:00.000Z'),
        };

        readApplyRepository.read.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(readApplyRepository.read).toHaveBeenCalledWith(input);
        expect(readApplyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the application does not exist', () => {
      it('should return null', async () => {
        const input = { id: 'missing-apply-id' };

        readApplyRepository.read.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(readApplyRepository.read).toHaveBeenCalledWith(input);
        expect(readApplyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { id: 'error-apply-id' };
        const errorMessage = 'Repository error';

        readApplyRepository.read.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(readApplyRepository.read).toHaveBeenCalledWith(input);
        expect(readApplyRepository.read).toHaveBeenCalledTimes(1);
      });
    });
  });
});

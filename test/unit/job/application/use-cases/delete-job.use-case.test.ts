import { DeleteJobUseCase } from '@src/modules/job/application/use-cases/delete-job.use-case';
import type { DeleteJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-job.repository.interface';
import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';

describe('DeleteJobUseCase', () => {
  let useCase: DeleteJobUseCase;
  let deleteJobRepository: jest.Mocked<DeleteJobRepositoryInterface>;

  const input: DeleteJobInputDto = {
    id: 'job-id',
  };

  beforeEach(() => {
    deleteJobRepository = {
      delete: jest.fn(),
    } as jest.Mocked<DeleteJobRepositoryInterface>;

    useCase = new DeleteJobUseCase(deleteJobRepository);
  });

  describe('execute', () => {
    describe('when the job is deleted', () => {
      it('should return true', async () => {
        deleteJobRepository.delete.mockResolvedValue(true);

        const result = await useCase.execute(input);

        expect(result).toBe(true);
        expect(deleteJobRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteJobRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the job is not deleted', () => {
      it('should return false', async () => {
        deleteJobRepository.delete.mockResolvedValue(false);

        const result = await useCase.execute(input);

        expect(result).toBe(false);
        expect(deleteJobRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteJobRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the repository receives the request', () => {
      it('should call repository with the correct input', async () => {
        deleteJobRepository.delete.mockResolvedValue(true);

        await useCase.execute(input);

        expect(deleteJobRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteJobRepository.delete).toHaveBeenCalledWith({
          id: 'job-id',
        });
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const error = new Error('Repository error');

        deleteJobRepository.delete.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(deleteJobRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteJobRepository.delete).toHaveBeenCalledWith(input);
      });
    });
  });
});

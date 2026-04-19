import { DeleteApplyUseCase } from '@src/modules/apply/application/use-cases/delete-apply.use-case';
import type { DeleteApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/delete-apply.repository.interface';
import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';

describe('DeleteApplyUseCase', () => {
  let useCase: DeleteApplyUseCase;
  let deleteApplyRepository: jest.Mocked<DeleteApplyRepositoryInterface>;

  const input: DeleteApplyInputDto = {
    id: 'apply-id',
  };

  beforeEach(() => {
    deleteApplyRepository = {
      delete: jest.fn(),
    } as jest.Mocked<DeleteApplyRepositoryInterface>;

    useCase = new DeleteApplyUseCase(deleteApplyRepository);
  });

  describe('execute', () => {
    describe('when the application is deleted', () => {
      it('should return true', async () => {
        deleteApplyRepository.delete.mockResolvedValue(true);

        const result = await useCase.execute(input);

        expect(result).toBe(true);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the application is not deleted', () => {
      it('should return false', async () => {
        deleteApplyRepository.delete.mockResolvedValue(false);

        const result = await useCase.execute(input);

        expect(result).toBe(false);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the repository receives the request', () => {
      it('should call repository with the correct input', async () => {
        deleteApplyRepository.delete.mockResolvedValue(true);

        await useCase.execute(input);

        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith({
          id: 'apply-id',
        });
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const error = new Error('Repository error');

        deleteApplyRepository.delete.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });
  });
});

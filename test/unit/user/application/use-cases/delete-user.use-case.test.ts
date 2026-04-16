import { DeleteUserUseCase } from '@src/modules/user/application/use-cases/delete-user.use-case';

import type { DeleteUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/delete-user.repository.interface';
import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;

  let deleteUserRepository: jest.Mocked<DeleteUserRepositoryInterface>;

  const input: DeleteUserInputDto = {
    id: 'user-id',
  };

  beforeEach(() => {
    deleteUserRepository = {
      delete: jest.fn(),
    };

    useCase = new DeleteUserUseCase(deleteUserRepository);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
      expect(deleteUserRepository).toBeDefined();
    });

    it('should delete a user successfully', async () => {
      deleteUserRepository.delete.mockResolvedValue(true);

      const result = await useCase.execute(input);

      expect(result).toBe(true);
      expect(deleteUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(deleteUserRepository.delete).toHaveBeenCalledWith(input);
    });

    it('should return false when repository does not delete the user', async () => {
      deleteUserRepository.delete.mockResolvedValue(false);

      const result = await useCase.execute(input);

      expect(result).toBe(false);
      expect(deleteUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(deleteUserRepository.delete).toHaveBeenCalledWith(input);
    });

    it('should call repository with correct input', async () => {
      deleteUserRepository.delete.mockResolvedValue(true);

      await useCase.execute(input);

      expect(deleteUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(deleteUserRepository.delete).toHaveBeenCalledWith({
        id: 'user-id',
      });
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Repository error');

      deleteUserRepository.delete.mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow(error);

      expect(deleteUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(deleteUserRepository.delete).toHaveBeenCalledWith(input);
    });
  });
});

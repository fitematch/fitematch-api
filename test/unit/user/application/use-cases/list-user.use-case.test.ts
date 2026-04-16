import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import type { ListUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/list-user.repository.interface';

describe('ListUserUseCase', () => {
  let useCase: ListUserUseCase;
  let listUserRepository: jest.Mocked<ListUserRepositoryInterface>;

  beforeEach(() => {
    listUserRepository = {
      list: jest.fn(),
    } as jest.Mocked<ListUserRepositoryInterface>;
    useCase = new ListUserUseCase(listUserRepository);
  });

  describe('execute', () => {
    it('should return a list of users', async () => {
      const input = { name: 'any' };
      const users = [
        {
          id: '1',
          name: 'John',
          email: 'john@mail.com',
          birthday: '2000-01-01',
        },
        {
          id: '2',
          name: 'Jane',
          email: 'jane@mail.com',
          birthday: '1990-01-01',
        },
      ];
      listUserRepository.list.mockResolvedValue(users);
      const result = await useCase.execute(input);
      expect(result).toEqual(
        users.map((u) => ({
          ...u,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })),
      );
      expect(listUserRepository.list).toHaveBeenCalledWith(input);
    });

    it('should return an empty array if no users found', async () => {
      const input = { name: 'none' };
      listUserRepository.list.mockResolvedValue([]);
      const result = await useCase.execute(input);
      expect(result).toEqual([]);
    });

    it('should handle repository errors safely', async () => {
      const input = { name: 'error' };
      const errorMessage = 'Repository error';
      listUserRepository.list.mockRejectedValue(new Error(errorMessage));
      await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
    });
  });
});

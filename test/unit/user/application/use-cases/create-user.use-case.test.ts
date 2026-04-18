import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { CreateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/create-user.repository.interface';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let createUserRepository: jest.Mocked<CreateUserRepositoryInterface>;

  beforeEach(() => {
    createUserRepository = {
      create: jest.fn(),
    } as jest.Mocked<CreateUserRepositoryInterface>;
    useCase = new CreateUserUseCase(createUserRepository);
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      const input = {
        name: 'John',
        email: 'john@mail.com',
        password: '123',
        birthday: '2000-01-01',
        candidateProfile: undefined,
      };
      const expected = { ...input, id: '1', status: UserStatusEnum.PENDING };
      createUserRepository.create.mockResolvedValue(expected);
      const result = await useCase.execute(input);
      expect(result).toEqual(expected);
      expect(createUserRepository.create).toHaveBeenCalledWith({
        ...input,
        status: UserStatusEnum.PENDING,
      });
    });

    it('should use provided status if present', async () => {
      const input = {
        name: 'Jane',
        email: 'jane@mail.com',
        password: 'abc',
        birthday: '1990-01-01',
        candidateProfile: {
          contacts: {
            phone: {
              countryCode: '55',
              areaCode: '11',
              number: 11999999999,
            },
          },
        },
        status: UserStatusEnum.ACTIVE,
      };
      const expected = { ...input, id: '2' };
      createUserRepository.create.mockResolvedValue(expected);
      const result = await useCase.execute(input);
      expect(result).toEqual(expected);
      expect(createUserRepository.create).toHaveBeenCalledWith(input);
    });
  });
});

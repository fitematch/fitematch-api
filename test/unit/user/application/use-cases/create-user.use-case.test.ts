import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { CreateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/create-user.repository.interface';
import EncryptUtils from '@src/shared/utils/encrypt.utils';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let createUserRepository: jest.Mocked<CreateUserRepositoryInterface>;
  let encryptUtils: jest.Mocked<EncryptUtils>;

  beforeEach(() => {
    createUserRepository = {
      create: jest.fn(),
    } as jest.Mocked<CreateUserRepositoryInterface>;
    encryptUtils = {
      encryptPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as unknown as jest.Mocked<EncryptUtils>;
    useCase = new CreateUserUseCase(createUserRepository, encryptUtils);
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
      const expected = {
        ...input,
        password: 'hashed-123',
        _id: '1',
        status: UserStatusEnum.PENDING,
      };
      encryptUtils.encryptPassword.mockResolvedValue('hashed-123');
      createUserRepository.create.mockResolvedValue(expected);
      const result = await useCase.execute(input);
      expect(result).toEqual(expected);
      expect(encryptUtils.encryptPassword).toHaveBeenCalledWith('123');
      expect(createUserRepository.create).toHaveBeenCalledWith({
        ...input,
        password: 'hashed-123',
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
              country: '55',
              number: '11999999999',
            },
          },
        },
        status: UserStatusEnum.ACTIVE,
      };
      const expected = { ...input, password: 'hashed-abc', _id: '2' };
      encryptUtils.encryptPassword.mockResolvedValue('hashed-abc');
      createUserRepository.create.mockResolvedValue(expected);
      const result = await useCase.execute(input);
      expect(result).toEqual(expected);
      expect(encryptUtils.encryptPassword).toHaveBeenCalledWith('abc');
      expect(createUserRepository.create).toHaveBeenCalledWith({
        ...input,
        password: 'hashed-abc',
      });
    });
  });
});

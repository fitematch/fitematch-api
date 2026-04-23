import { BadRequestException, ConflictException } from '@nestjs/common';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { SignUpRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/sign-up.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import { SignUpUseCase } from '@src/modules/auth/application/use-cases/sign-up.use-case';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;
  let signUpRepository: jest.Mocked<SignUpRepositoryInterface>;
  let activationCodeRepository: jest.Mocked<ActivationCodeRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;

  beforeEach(() => {
    signUpRepository = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<SignUpRepositoryInterface>;
    activationCodeRepository = {
      create: jest.fn(),
      invalidateActiveCodes: jest.fn(),
      findActiveCodeByUserIdAndType: jest.fn(),
      incrementAttempts: jest.fn(),
      markAsUsed: jest.fn(),
    } as jest.Mocked<ActivationCodeRepositoryInterface>;
    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<HashServiceInterface>;

    useCase = new SignUpUseCase(
      signUpRepository,
      activationCodeRepository,
      hashService,
    );
  });

  describe('execute', () => {
    describe('when the sign up payload is valid', () => {
      it('should create a pending user and an activation code', async () => {
        const input = {
          name: 'John Doe',
          email: 'john@fitematch.com',
          password: 'plain-password',
          birthday: '1995-01-10',
          productRole: ProductRoleEnum.CANDIDATE,
        };
        const createdUser = {
          id: 'user-1',
          name: input.name,
          email: input.email,
          birthday: input.birthday,
          productRole: input.productRole,
          status: UserStatusEnum.PENDING,
          createdAt: new Date('2026-04-21T12:00:00.000Z'),
          updatedAt: new Date('2026-04-21T12:00:00.000Z'),
        };

        signUpRepository.existsByEmail.mockResolvedValue(false);
        hashService.hash
          .mockResolvedValueOnce('hashed-password')
          .mockResolvedValueOnce('hashed-activation-code');
        signUpRepository.create.mockResolvedValue(createdUser);
        activationCodeRepository.invalidateActiveCodes.mockResolvedValue();
        activationCodeRepository.create.mockResolvedValue({
          id: 'activation-1',
          userId: 'user-1',
          codeHash: 'hashed-activation-code',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date('2026-04-21T12:15:00.000Z'),
          attemptsCount: 0,
          maxAttempts: 5,
          createdAt: new Date('2026-04-21T12:00:00.000Z'),
          updatedAt: new Date('2026-04-21T12:00:00.000Z'),
        });

        const codeSpy = jest
          .spyOn(ActivationCodeUtils, 'generateSixDigits')
          .mockReturnValue('123456');

        const result = await useCase.execute(input);

        expect(result).toEqual(createdUser);
        expect(signUpRepository.existsByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(hashService.hash).toHaveBeenNthCalledWith(1, input.password);
        expect(signUpRepository.create).toHaveBeenCalledWith({
          ...input,
          password: 'hashed-password',
          status: 'pending',
        });
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).toHaveBeenCalledWith(
          createdUser.id,
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
        expect(hashService.hash).toHaveBeenNthCalledWith(2, '123456');
        expect(activationCodeRepository.create).toHaveBeenCalledWith({
          userId: createdUser.id,
          codeHash: 'hashed-activation-code',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: expect.any(Date),
          attemptsCount: 0,
          maxAttempts: 5,
        });

        codeSpy.mockRestore();
      });
    });

    describe('when the product role is invalid', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          name: 'John Doe',
          email: 'john@fitematch.com',
          password: 'plain-password',
          birthday: '1995-01-10',
          productRole: 'admin' as ProductRoleEnum,
        };

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid product role for sign up.'),
        );
        expect(signUpRepository.existsByEmail).not.toHaveBeenCalled();
        expect(hashService.hash).not.toHaveBeenCalled();
        expect(signUpRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the email already exists', () => {
      it('should throw a conflict exception', async () => {
        const input = {
          name: 'John Doe',
          email: 'john@fitematch.com',
          password: 'plain-password',
          birthday: '1995-01-10',
          productRole: ProductRoleEnum.RECRUITER,
        };

        signUpRepository.existsByEmail.mockResolvedValue(true);

        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException('Email already in use.'),
        );
        expect(signUpRepository.existsByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(hashService.hash).not.toHaveBeenCalled();
        expect(signUpRepository.create).not.toHaveBeenCalled();
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).not.toHaveBeenCalled();
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          name: 'John Doe',
          email: 'john@fitematch.com',
          password: 'plain-password',
          birthday: '1995-01-10',
          productRole: ProductRoleEnum.CANDIDATE,
        };

        signUpRepository.existsByEmail.mockResolvedValue(false);
        hashService.hash.mockResolvedValue('hashed-password');
        signUpRepository.create.mockRejectedValue(
          new Error('Repository error'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          'Repository error',
        );
        expect(hashService.hash).toHaveBeenCalledWith(input.password);
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
      });
    });
  });
});

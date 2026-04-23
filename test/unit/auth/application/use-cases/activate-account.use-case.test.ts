import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { ActivateAccountRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activate-account.repository.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import { ActivateAccountUseCase } from '@src/modules/auth/application/use-cases/activate-account.use-case';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

describe('ActivateAccountUseCase', () => {
  let useCase: ActivateAccountUseCase;
  let activateAccountRepository: jest.Mocked<ActivateAccountRepositoryInterface>;
  let activationCodeRepository: jest.Mocked<ActivationCodeRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;

  beforeEach(() => {
    activateAccountRepository = {
      findByEmail: jest.fn(),
      activateUser: jest.fn(),
    } as jest.Mocked<ActivateAccountRepositoryInterface>;
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

    useCase = new ActivateAccountUseCase(
      activateAccountRepository,
      activationCodeRepository,
      hashService,
    );
  });

  describe('execute', () => {
    describe('when the user and activation code are valid', () => {
      it('should mark the code as used and activate the user account', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: '123456',
        };
        const user = {
          id: 'user-1',
          email: input.email,
          status: 'pending',
        };
        const activationCode = {
          id: 'activation-1',
          userId: user.id,
          codeHash: 'hashed-code',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          attemptsCount: 0,
          maxAttempts: 3,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        };

        activateAccountRepository.findByEmail.mockResolvedValue(user);
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          activationCode,
        );
        hashService.compare.mockResolvedValue(true);
        activationCodeRepository.markAsUsed.mockResolvedValue();
        activateAccountRepository.activateUser.mockResolvedValue();

        const result = await useCase.execute(input);

        expect(result).toEqual({
          message: 'Account activated successfully.',
        });
        expect(activateAccountRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.findActiveCodeByUserIdAndType,
        ).toHaveBeenCalledWith(
          user.id,
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
        expect(hashService.compare).toHaveBeenCalledWith(
          input.code,
          activationCode.codeHash,
        );
        expect(activationCodeRepository.markAsUsed).toHaveBeenCalledWith(
          activationCode.id,
        );
        expect(activateAccountRepository.activateUser).toHaveBeenCalledWith(
          user.id,
        );
      });
    });

    describe('when the user does not exist', () => {
      it('should throw a not found exception', async () => {
        const input = {
          email: 'missing@fitematch.com',
          code: '123456',
        };

        activateAccountRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new NotFoundException('User not found.'),
        );
        expect(activateAccountRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.findActiveCodeByUserIdAndType,
        ).not.toHaveBeenCalled();
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when the account is already active', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'active@fitematch.com',
          code: '123456',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'active',
        });

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Account already activated.'),
        );
        expect(
          activationCodeRepository.findActiveCodeByUserIdAndType,
        ).not.toHaveBeenCalled();
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when there is no active activation code', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: '000000',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          null,
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid activation code.'),
        );
        expect(
          activationCodeRepository.findActiveCodeByUserIdAndType,
        ).toHaveBeenCalledWith(
          'user-1',
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(
          activationCodeRepository.incrementAttempts,
        ).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when the activation code is expired', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: '123456',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          {
            id: 'activation-1',
            userId: 'user-1',
            codeHash: 'hashed-code',
            type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
            expiresAt: new Date(Date.now() - 60 * 1000),
            attemptsCount: 0,
            maxAttempts: 3,
            createdAt: new Date('2026-04-22T12:00:00.000Z'),
            updatedAt: new Date('2026-04-22T12:00:00.000Z'),
          },
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Activation code expired.'),
        );
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(
          activationCodeRepository.incrementAttempts,
        ).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when the activation code is blocked by too many attempts', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: '123456',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          {
            id: 'activation-1',
            userId: 'user-1',
            codeHash: 'hashed-code',
            type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
            expiresAt: new Date(Date.now() + 60 * 1000),
            attemptsCount: 3,
            maxAttempts: 3,
            createdAt: new Date('2026-04-22T12:00:00.000Z'),
            updatedAt: new Date('2026-04-22T12:00:00.000Z'),
          },
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException(
            'Activation code blocked by too many attempts.',
          ),
        );
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(
          activationCodeRepository.incrementAttempts,
        ).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
      });
    });

    describe('when the informed activation code does not match', () => {
      it('should increment attempts and throw a bad request exception', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: 'wrong-code',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          {
            id: 'activation-1',
            userId: 'user-1',
            codeHash: 'hashed-code',
            type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
            expiresAt: new Date(Date.now() + 60 * 1000),
            attemptsCount: 1,
            maxAttempts: 3,
            createdAt: new Date('2026-04-22T12:00:00.000Z'),
            updatedAt: new Date('2026-04-22T12:00:00.000Z'),
          },
        );
        hashService.compare.mockResolvedValue(false);
        activationCodeRepository.incrementAttempts.mockResolvedValue();

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid activation code.'),
        );
        expect(hashService.compare).toHaveBeenCalledWith(
          input.code,
          'hashed-code',
        );
        expect(activationCodeRepository.incrementAttempts).toHaveBeenCalledWith(
          'activation-1',
        );
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error after validating the code', () => {
      it('should propagate the error', async () => {
        const input = {
          email: 'john@fitematch.com',
          code: '123456',
        };

        activateAccountRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.findActiveCodeByUserIdAndType.mockResolvedValue(
          {
            id: 'activation-1',
            userId: 'user-1',
            codeHash: 'hashed-code',
            type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
            expiresAt: new Date(Date.now() + 60 * 1000),
            attemptsCount: 0,
            maxAttempts: 3,
            createdAt: new Date('2026-04-22T12:00:00.000Z'),
            updatedAt: new Date('2026-04-22T12:00:00.000Z'),
          },
        );
        hashService.compare.mockResolvedValue(true);
        activationCodeRepository.markAsUsed.mockResolvedValue();
        activateAccountRepository.activateUser.mockRejectedValue(
          new Error('Repository error'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          'Repository error',
        );
        expect(activationCodeRepository.markAsUsed).toHaveBeenCalledWith(
          'activation-1',
        );
        expect(activateAccountRepository.activateUser).toHaveBeenCalledWith(
          'user-1',
        );
      });
    });
  });
});

import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { ActivateAccountRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activate-account.repository.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { ActivateAccountUseCase } from '@src/modules/auth/application/use-cases/activate-account.use-case';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

describe('ActivateAccountUseCase', () => {
  let useCase: ActivateAccountUseCase;
  let activateAccountRepository: jest.Mocked<ActivateAccountRepositoryInterface>;
  let activationCodeRepository: jest.Mocked<ActivationCodeRepositoryInterface>;

  beforeEach(() => {
    activateAccountRepository = {
      findByEmail: jest.fn(),
      activateUser: jest.fn(),
    } as jest.Mocked<ActivateAccountRepositoryInterface>;
    activationCodeRepository = {
      create: jest.fn(),
      invalidateActiveCodes: jest.fn(),
      findValidCode: jest.fn(),
      markAsUsed: jest.fn(),
    } as jest.Mocked<ActivationCodeRepositoryInterface>;

    useCase = new ActivateAccountUseCase(
      activateAccountRepository,
      activationCodeRepository,
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
          code: input.code,
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          usedAt: null,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        };

        activateAccountRepository.findByEmail.mockResolvedValue(user);
        activationCodeRepository.findValidCode.mockResolvedValue(
          activationCode,
        );
        activationCodeRepository.markAsUsed.mockResolvedValue();
        activateAccountRepository.activateUser.mockResolvedValue();

        const result = await useCase.execute(input);

        expect(result).toEqual({
          message: 'Account activated successfully.',
        });
        expect(activateAccountRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(activationCodeRepository.findValidCode).toHaveBeenCalledWith(
          user.id,
          input.code,
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
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
        expect(activationCodeRepository.findValidCode).not.toHaveBeenCalled();
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
        expect(activationCodeRepository.findValidCode).not.toHaveBeenCalled();
        expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
        expect(activateAccountRepository.activateUser).not.toHaveBeenCalled();
      });
    });

    describe('when the activation code is invalid', () => {
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
        activationCodeRepository.findValidCode.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid activation code.'),
        );
        expect(activationCodeRepository.findValidCode).toHaveBeenCalledWith(
          'user-1',
          input.code,
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
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
        activationCodeRepository.findValidCode.mockResolvedValue({
          id: 'activation-1',
          userId: 'user-1',
          code: input.code,
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date(Date.now() - 60 * 1000),
          usedAt: null,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Activation code expired.'),
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
        activationCodeRepository.findValidCode.mockResolvedValue({
          id: 'activation-1',
          userId: 'user-1',
          code: input.code,
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date(Date.now() + 60 * 1000),
          usedAt: null,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });
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

import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { EmailProviderInterface } from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { CreateActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/create-activation-code.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import { CreateActivationCodeUseCase } from '@src/modules/auth/application/use-cases/create-activation-code.use-case';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

describe('CreateActivationCodeUseCase', () => {
  let useCase: CreateActivationCodeUseCase;
  let createActivationCodeRepository: jest.Mocked<CreateActivationCodeRepositoryInterface>;
  let activationCodeRepository: jest.Mocked<ActivationCodeRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;
  let emailProvider: jest.Mocked<EmailProviderInterface>;

  beforeEach(() => {
    createActivationCodeRepository = {
      findByEmail: jest.fn(),
    } as jest.Mocked<CreateActivationCodeRepositoryInterface>;
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
    emailProvider = {
      sendActivationCode: jest.fn(),
    } as jest.Mocked<EmailProviderInterface>;

    useCase = new CreateActivationCodeUseCase(
      createActivationCodeRepository,
      activationCodeRepository,
      hashService,
      emailProvider,
    );
  });

  describe('execute', () => {
    describe('when the user exists and is pending', () => {
      it('should invalidate previous codes and create a new activation code', async () => {
        const input = {
          email: 'john@fitematch.com',
        };
        const user = {
          id: 'user-1',
          name: 'John Doe',
          email: input.email,
          status: 'pending',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue(user);
        activationCodeRepository.invalidateActiveCodes.mockResolvedValue();
        hashService.hash.mockResolvedValue('hashed-123456');
        activationCodeRepository.create.mockResolvedValue({
          id: 'activation-1',
          userId: user.id,
          codeHash: 'hashed-123456',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date('2026-04-22T12:15:00.000Z'),
          attemptsCount: 0,
          maxAttempts: 5,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });

        const codeSpy = jest
          .spyOn(ActivationCodeUtils, 'generateSixDigits')
          .mockReturnValue('123456');

        const result = await useCase.execute(input);

        expect(result).toEqual({
          message: 'Activation code generated successfully.',
        });
        expect(createActivationCodeRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).toHaveBeenCalledWith(
          user.id,
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
        expect(hashService.hash).toHaveBeenCalledWith('123456');
        expect(activationCodeRepository.create).toHaveBeenCalledWith({
          userId: user.id,
          codeHash: 'hashed-123456',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: expect.any(Date),
          attemptsCount: 0,
          maxAttempts: 5,
        });
        expect(emailProvider.sendActivationCode).toHaveBeenCalledWith({
          to: user.email,
          name: user.name,
          code: '123456',
          expiresInMinutes: 15,
        });

        codeSpy.mockRestore();
      });
    });

    describe('when the user does not exist', () => {
      it('should throw a not found exception', async () => {
        const input = {
          email: 'missing@fitematch.com',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new NotFoundException('User not found.'),
        );
        expect(createActivationCodeRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).not.toHaveBeenCalled();
        expect(hashService.hash).not.toHaveBeenCalled();
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
        expect(emailProvider.sendActivationCode).not.toHaveBeenCalled();
      });
    });

    describe('when the account is already active', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'active@fitematch.com',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          name: 'Active User',
          email: input.email,
          status: 'active',
        });

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Account already activated.'),
        );
        expect(createActivationCodeRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).not.toHaveBeenCalled();
        expect(hashService.hash).not.toHaveBeenCalled();
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
        expect(emailProvider.sendActivationCode).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          email: 'john@fitematch.com',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
          name: 'John Doe',
          email: input.email,
          status: 'pending',
        });
        activationCodeRepository.invalidateActiveCodes.mockRejectedValue(
          new Error('Repository error'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          'Repository error',
        );
        expect(createActivationCodeRepository.findByEmail).toHaveBeenCalledWith(
          input.email,
        );
        expect(
          activationCodeRepository.invalidateActiveCodes,
        ).toHaveBeenCalledWith(
          'user-1',
          ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
        );
        expect(hashService.hash).not.toHaveBeenCalled();
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
        expect(emailProvider.sendActivationCode).not.toHaveBeenCalled();
      });
    });
  });
});

import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { CreateActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/create-activation-code.repository.interface';
import { CreateActivationCodeUseCase } from '@src/modules/auth/application/use-cases/create-activation-code.use-case';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

describe('CreateActivationCodeUseCase', () => {
  let useCase: CreateActivationCodeUseCase;
  let createActivationCodeRepository: jest.Mocked<CreateActivationCodeRepositoryInterface>;
  let activationCodeRepository: jest.Mocked<ActivationCodeRepositoryInterface>;

  beforeEach(() => {
    createActivationCodeRepository = {
      findByEmail: jest.fn(),
    } as jest.Mocked<CreateActivationCodeRepositoryInterface>;
    activationCodeRepository = {
      create: jest.fn(),
      invalidateActiveCodes: jest.fn(),
      findValidCode: jest.fn(),
      markAsUsed: jest.fn(),
    } as jest.Mocked<ActivationCodeRepositoryInterface>;

    useCase = new CreateActivationCodeUseCase(
      createActivationCodeRepository,
      activationCodeRepository,
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
          email: input.email,
          status: 'pending',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue(user);
        activationCodeRepository.invalidateActiveCodes.mockResolvedValue();
        activationCodeRepository.create.mockResolvedValue({
          id: 'activation-1',
          userId: user.id,
          code: '123456',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: new Date('2026-04-22T12:15:00.000Z'),
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
        expect(activationCodeRepository.create).toHaveBeenCalledWith({
          userId: user.id,
          code: '123456',
          type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
          expiresAt: expect.any(Date),
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
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the account is already active', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          email: 'active@fitematch.com',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
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
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          email: 'john@fitematch.com',
        };

        createActivationCodeRepository.findByEmail.mockResolvedValue({
          id: 'user-1',
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
        expect(activationCodeRepository.create).not.toHaveBeenCalled();
      });
    });
  });
});

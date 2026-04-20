import { UpdateUserUseCase } from '@src/modules/user/application/use-cases/update-user.use-case';
import type { UpdateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/update-user.repository.interface';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let updateUserRepository: jest.Mocked<UpdateUserRepositoryInterface>;

  beforeEach(() => {
    updateUserRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateUserRepositoryInterface>;

    useCase = new UpdateUserUseCase(updateUserRepository);
  });

  describe('execute', () => {
    describe('when the user exists', () => {
      it('should return the updated user with all fields', async () => {
        const input = {
          id: 'user-id-1',
          name: 'Rebecca Chambers',
          email: 'rebecca@fitematch.com',
          birthday: '1998-07-29',
          candidateProfile: {
            documents: {
              rg: {
                number: '123456789',
                issuer: 'SSP',
                state: 'SP',
              },
              cpf: {
                number: '12345678901',
              },
              cref: {
                number: '98765',
                category: 'SP',
                isActive: true,
              },
              passport: {
                number: 'AB123456',
                country: 'Brasil',
                expirationDate: new Date('2030-01-01T00:00:00.000Z'),
              },
            },
            contacts: {
              phone: {
                country: '55',
                number: '11999999999',
                isWhatsapp: true,
                isTelegram: false,
              },
              address: {
                street: 'Rua A',
                number: '123',
                complement: 'Apto 1',
                neighborhood: 'Centro',
                city: 'Sao Paulo',
                state: 'SP',
                country: 'Brasil',
                zipCode: '12345678',
              },
              social: {
                facebook: 'https://facebook.com/user',
                instagram: 'https://instagram.com/user',
                x: 'https://x.com/user',
                youtube: 'https://youtube.com/user',
                tiktok: 'https://tiktok.com/@user',
                linkedin: 'https://linkedin.com/in/user',
              },
            },
            media: {
              resumeUrl: 'https://example.com/resume.pdf',
            },
          },
          status: UserStatusEnum.ACTIVE,
        };

        const output = {
          ...input,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        updateUserRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateUserRepository.update).toHaveBeenCalledWith(input);
        expect(updateUserRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the user does not exist', () => {
      it('should return null', async () => {
        const input = {
          id: 'missing-user-id',
          name: 'Rebecca Chambers',
        };

        updateUserRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateUserRepository.update).toHaveBeenCalledWith(input);
        expect(updateUserRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          id: 'error-user-id',
          email: 'error@fitematch.com',
        };
        const errorMessage = 'Repository error';

        updateUserRepository.update.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(updateUserRepository.update).toHaveBeenCalledWith(input);
        expect(updateUserRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

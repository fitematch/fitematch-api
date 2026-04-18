import { ReadUserUseCase } from '@src/modules/user/application/use-cases/read-user.use-case';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

describe('ReadUserUseCase', () => {
  let useCase: ReadUserUseCase;
  let readUserRepository: jest.Mocked<ReadUserRepositoryInterface>;

  beforeEach(() => {
    readUserRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadUserRepositoryInterface>;

    useCase = new ReadUserUseCase(readUserRepository);
  });

  describe('execute', () => {
    describe('when the user exists', () => {
      it('should return the user with all mapped fields', async () => {
        const input = { id: 'user-id-1' };

        const output = {
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
                countryCode: '55',
                areaCode: '11',
                number: '11999999999',
                isWhatsapp: true,
                isTelegram: false,
              },
              address: {
                street: 'Rua A',
                number: '10',
                complement: 'Casa',
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
          recruiterProfile: {
            companyId: 'company-id-1',
            position: 'Recruiter',
            contacts: {
              phone: {
                countryCode: '55',
                areaCode: '21',
                number: '21999999999',
                isWhatsapp: true,
                isTelegram: true,
              },
            },
          },
          productRole: ProductRoleEnum.CANDIDATE,
          adminRole: AdminRoleEnum.ADMIN,
          status: UserStatusEnum.ACTIVE,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        readUserRepository.read.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(readUserRepository.read).toHaveBeenCalledWith(input);
        expect(readUserRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the user does not exist', () => {
      it('should return null', async () => {
        const input = { id: 'missing-user-id' };

        readUserRepository.read.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(readUserRepository.read).toHaveBeenCalledWith(input);
        expect(readUserRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { id: 'error-user-id' };
        const errorMessage = 'Repository error';

        readUserRepository.read.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(readUserRepository.read).toHaveBeenCalledWith(input);
        expect(readUserRepository.read).toHaveBeenCalledTimes(1);
      });
    });
  });
});

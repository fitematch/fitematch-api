import { UpdateUserUseCase } from '@src/modules/user/application/use-cases/update-user.use-case';
import type { UpdateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/update-user.repository.interface';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { UpdateUserRequestMapper } from '@src/modules/user/adapters/http/mappers/update-user-request.mapper';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let repository: jest.Mocked<UpdateUserRepositoryInterface>;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    };

    useCase = new UpdateUserUseCase(repository);
  });

  describe('execute', () => {
    describe('when the user exists', () => {
      it('should return the updated user', async () => {
        const input = {
          id: 'user-id-1',
          name: 'João Silva',
          email: 'joao@email.com',
          birthday: '1995-08-15',
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
            },
            contacts: {
              phone: {
                countryCode: '55',
                areaCode: '11',
                number: 11999999999,
                isWhatsapp: true,
                isTelegram: false,
              },
              address: {
                street: 'Rua A',
                number: 123,
                complement: 'Apto 1',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                zipCode: 12345678,
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

        repository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(repository.update).toHaveBeenCalledWith(input);
        expect(result).toEqual(output);
      });
    });

    describe('when the user does not exist', () => {
      it('should return null', async () => {
        const input = {
          id: 'missing-user-id',
          name: 'João Silva',
        };

        repository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(repository.update).toHaveBeenCalledWith(input);
        expect(result).toBeNull();
      });
    });
  });
});

describe('UpdateUserRequestMapper', () => {
  describe('toInput', () => {
    describe('when the payload is complete', () => {
      it('should map params and body to input dto', () => {
        const params = {
          id: 'user-id-1',
        };

        const body = {
          name: 'João Silva',
          email: 'joao@email.com',
          password: '12345678',
          birthday: '1995-08-15',
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
                expirationDate: '2030-01-01',
              },
            },
            contacts: {
              phone: {
                countryCode: '55',
                areaCode: '11',
                number: 11999999999,
                isWhatsapp: true,
                isTelegram: false,
              },
              address: {
                street: 'Rua A',
                number: 123,
                complement: 'Apto 1',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                zipCode: 12345678,
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
          productRole: ProductRoleEnum.CANDIDATE,
          adminRole: AdminRoleEnum.ADMIN,
          status: UserStatusEnum.ACTIVE,
        };

        const result = UpdateUserRequestMapper.toInput(params, body);

        expect(result).toEqual({
          id: 'user-id-1',
          name: 'João Silva',
          email: 'joao@email.com',
          password: '12345678',
          birthday: '1995-08-15',
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
                expirationDate: new Date('2030-01-01'),
              },
            },
            contacts: {
              phone: {
                countryCode: '55',
                areaCode: '11',
                number: 11999999999,
                isWhatsapp: true,
                isTelegram: false,
              },
              address: {
                street: 'Rua A',
                number: 123,
                complement: 'Apto 1',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                zipCode: 12345678,
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
          productRole: ProductRoleEnum.CANDIDATE,
          adminRole: AdminRoleEnum.ADMIN,
          status: UserStatusEnum.ACTIVE,
        });
      });
    });

    describe('when the payload is partial', () => {
      it('should map only the informed fields', () => {
        const params = {
          id: 'user-id-2',
        };

        const body = {
          email: 'novo@email.com',
          status: UserStatusEnum.INACTIVE,
        };

        const result = UpdateUserRequestMapper.toInput(params, body);

        expect(result).toEqual({
          id: 'user-id-2',
          name: undefined,
          email: 'novo@email.com',
          password: undefined,
          birthday: undefined,
          candidateProfile: undefined,
          recruiterProfile: undefined,
          productRole: undefined,
          adminRole: undefined,
          status: UserStatusEnum.INACTIVE,
        });
      });
    });
  });
});

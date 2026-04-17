import { ReadUserUseCase } from '@src/modules/user/application/use-cases/read-user.use-case';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

describe('ReadUserUseCase', () => {
  let useCase: ReadUserUseCase;
  let repository: jest.Mocked<ReadUserRepositoryInterface>;

  beforeEach(() => {
    repository = {
      read: jest.fn(),
    };

    useCase = new ReadUserUseCase(repository);
  });

  describe('execute', () => {
    it('should return a user when repository finds one', async () => {
      const input = { id: 'user-id-1' };

      const output = {
        id: 'user-id-1',
        name: 'João Silva',
        email: 'joao@email.com',
        birthday: '1995-08-15',
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
            number: 10,
            complement: 'Casa',
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
        status: UserStatusEnum.ACTIVE,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };

      repository.read.mockResolvedValue(output);

      const result = await useCase.execute(input);

      expect(repository.read.mock.calls).toHaveLength(1);
      expect(repository.read.mock.calls[0]).toEqual([input]);
      expect(result).toEqual(output);
    });

    it('should return null when repository does not find the user', async () => {
      const input = { id: 'missing-user-id' };

      repository.read.mockResolvedValue(null);

      const result = await useCase.execute(input);

      expect(repository.read.mock.calls).toHaveLength(1);
      expect(repository.read.mock.calls[0]).toEqual([input]);
      expect(result).toBeNull();
    });
  });
});

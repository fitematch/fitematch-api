import { ListPublicCompaniesUseCase } from '@src/modules/company/application/use-cases/list-public-companies.use-case';
import type { ListPublicCompaniesRepository } from '@src/modules/company/application/contracts/repositories/list-public-companies.repository';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('ListPublicCompaniesUseCase', () => {
  let useCase: ListPublicCompaniesUseCase;
  let repository: jest.Mocked<ListPublicCompaniesRepository>;

  beforeEach(() => {
    repository = {
      findPublicActiveCompanies: jest.fn(),
    } as jest.Mocked<ListPublicCompaniesRepository>;

    useCase = new ListPublicCompaniesUseCase(repository);
  });

  describe('execute', () => {
    it('should return the mapped list of public companies', async () => {
      repository.findPublicActiveCompanies.mockResolvedValue([
        {
          _id: 'company-1',
          slug: 'fitematch',
          tradeName: 'Fitematch',
          legalName: 'Fitematch Tecnologia Ltda',
          contacts: {
            email: 'contato@fitematch.com',
            phone: {
              country: '+55',
              number: '11999999999',
              isWhatsapp: true,
              isTelegram: false,
            },
            address: {
              street: 'Rua A',
              number: '100',
              neighborhood: 'Centro',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01000000',
            },
          },
          documents: {
            cnpj: '12.345.678/0001-90',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.fitematch.com/logo.png',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-28T10:00:00.000Z'),
          updatedAt: new Date('2026-04-28T10:15:00.000Z'),
        },
        {
          _id: 'company-2',
          slug: 'gym-labs',
          tradeName: 'Gym Labs',
          legalName: 'Gym Labs LTDA',
          contacts: {
            email: 'contact@gymlabs.com',
            phone: {
              country: '+55',
              number: '11888888888',
              isWhatsapp: false,
              isTelegram: true,
            },
            address: {
              street: 'Rua B',
              number: '200',
              neighborhood: 'Bela Vista',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01310000',
            },
          },
          documents: {
            cnpj: '98.765.432/0001-10',
            isVerified: true,
          },
          media: {},
          status: CompanyStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-28T11:00:00.000Z'),
          updatedAt: new Date('2026-04-28T11:20:00.000Z'),
        },
      ]);

      const result = await useCase.execute();

      expect(result).toEqual([
        {
          id: 'company-1',
          slug: 'fitematch',
          tradeName: 'Fitematch',
          media: {
            logoUrl: 'https://cdn.fitematch.com/logo.png',
          },
        },
        {
          id: 'company-2',
          slug: 'gym-labs',
          tradeName: 'Gym Labs',
          media: {
            logoUrl: undefined,
          },
        },
      ]);
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledWith();
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no public companies are found', async () => {
      repository.findPublicActiveCompanies.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledWith();
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Repository error');

      repository.findPublicActiveCompanies.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledWith();
      expect(repository.findPublicActiveCompanies).toHaveBeenCalledTimes(1);
    });
  });
});

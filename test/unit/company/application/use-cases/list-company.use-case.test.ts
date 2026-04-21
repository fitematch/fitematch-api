import { ListCompanyUseCase } from '@src/modules/company/application/use-cases/list-company.use-case';
import type { ListCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/list-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('ListCompanyUseCase', () => {
  let useCase: ListCompanyUseCase;
  let listCompanyRepository: jest.Mocked<ListCompanyRepositoryInterface>;

  beforeEach(() => {
    listCompanyRepository = {
      list: jest.fn(),
    } as jest.Mocked<ListCompanyRepositoryInterface>;

    useCase = new ListCompanyUseCase(listCompanyRepository);
  });

  describe('execute', () => {
    it('should return a list of companies', async () => {
      const input = {
        search: 'umbrella',
        page: 1,
        limit: 10,
        status: CompanyStatusEnum.ACTIVE,
      };

      const companies = [
        {
          _id: 'company-1',
          slug: 'umbrella-corp',
          tradeName: 'Umbrella Corp',
          legalName: 'Umbrella Corporation S.A.',
          contacts: {
            email: 'contact@umbrella.com',
            website: 'https://umbrella.com',
            phone: {
              country: '+55',
              number: '999999999',
              isWhatsapp: true,
              isTelegram: false,
            },
            address: {
              street: 'Rua das Empresas',
              number: '1000',
              complement: 'Sala 12',
              neighborhood: 'Centro',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
            social: {
              instagram: '@umbrella',
              linkedin: 'https://linkedin.com/company/umbrella',
            },
          },
          documents: {
            cnpj: '12.345.678/0001-90',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.example.com/umbrella.png',
          },
          audit: {
            createdByUserId: 'user-1',
          },
          approval: {
            approvedAt: new Date('2024-01-10T00:00:00.000Z'),
            approvedByUserId: 'admin-1',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        },
        {
          _id: 'company-2',
          slug: 'stars-labs',
          tradeName: 'S.T.A.R.S. Labs',
          legalName: 'STARS Labs LTDA',
          contacts: {
            email: 'contact@starslabs.com',
            phone: {
              country: '+1',
              number: '5550101',
              isWhatsapp: false,
              isTelegram: true,
            },
            address: {
              street: 'Research Avenue',
              number: '42',
              neighborhood: 'Midtown',
              city: 'New York',
              state: 'NY',
              country: 'United States',
              zipCode: '10001',
            },
          },
          documents: {
            cnpj: '98.765.432/0001-10',
            isVerified: false,
          },
          media: {},
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-02-01T00:00:00.000Z'),
          updatedAt: new Date('2024-02-03T00:00:00.000Z'),
        },
      ];

      listCompanyRepository.list.mockResolvedValue(companies);

      const result = await useCase.execute(input);

      expect(result).toEqual(companies);
      expect(listCompanyRepository.list).toHaveBeenCalledWith(input);
      expect(listCompanyRepository.list).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no companies are found', async () => {
      const input = { search: 'missing-company' };

      listCompanyRepository.list.mockResolvedValue([]);

      const result = await useCase.execute(input);

      expect(result).toEqual([]);
      expect(listCompanyRepository.list).toHaveBeenCalledWith(input);
      expect(listCompanyRepository.list).toHaveBeenCalledTimes(1);
    });

    it('should map all company fields from repository output', async () => {
      const input = { page: 2, limit: 1 };

      const createdAt = new Date('2024-03-01T00:00:00.000Z');
      const updatedAt = new Date('2024-03-05T00:00:00.000Z');
      const approvedAt = new Date('2024-03-06T00:00:00.000Z');

      listCompanyRepository.list.mockResolvedValue([
        {
          _id: 'company-3',
          slug: 'raccoon-fitness',
          tradeName: 'Raccoon Fitness',
          legalName: 'Raccoon Fitness LTDA',
          contacts: {
            email: 'hello@raccoonfitness.com',
            website: 'https://raccoonfitness.com',
            phone: {
              country: '+55',
              number: '988887777',
              isWhatsapp: true,
              isTelegram: true,
            },
            address: {
              street: 'Avenida Central',
              number: '500',
              complement: 'Andar 5',
              neighborhood: 'Centro',
              city: 'Rio de Janeiro',
              state: 'RJ',
              country: 'Brasil',
              zipCode: '20000-000',
            },
            social: {
              facebook: 'https://facebook.com/raccoonfitness',
              instagram: '@raccoonfitness',
              x: '@raccoonfitness',
              youtube: 'https://youtube.com/raccoonfitness',
              tiktok: '@raccoonfitness',
              linkedin: 'https://linkedin.com/company/raccoonfitness',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-44',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.example.com/raccoon-fitness.png',
          },
          audit: {
            createdByUserId: 'creator-1',
          },
          approval: {
            approvedAt,
            approvedByUserId: 'approver-1',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ]);

      const result = await useCase.execute(input);

      expect(result).toEqual([
        {
          _id: 'company-3',
          slug: 'raccoon-fitness',
          tradeName: 'Raccoon Fitness',
          legalName: 'Raccoon Fitness LTDA',
          contacts: {
            email: 'hello@raccoonfitness.com',
            website: 'https://raccoonfitness.com',
            phone: {
              country: '+55',
              number: '988887777',
              isWhatsapp: true,
              isTelegram: true,
            },
            address: {
              street: 'Avenida Central',
              number: '500',
              complement: 'Andar 5',
              neighborhood: 'Centro',
              city: 'Rio de Janeiro',
              state: 'RJ',
              country: 'Brasil',
              zipCode: '20000-000',
            },
            social: {
              facebook: 'https://facebook.com/raccoonfitness',
              instagram: '@raccoonfitness',
              x: '@raccoonfitness',
              youtube: 'https://youtube.com/raccoonfitness',
              tiktok: '@raccoonfitness',
              linkedin: 'https://linkedin.com/company/raccoonfitness',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-44',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.example.com/raccoon-fitness.png',
          },
          audit: {
            createdByUserId: 'creator-1',
          },
          approval: {
            approvedAt,
            approvedByUserId: 'approver-1',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ]);
    });

    it('should propagate repository errors', async () => {
      const input = { search: 'error-company' };
      const errorMessage = 'Repository error';

      listCompanyRepository.list.mockRejectedValue(new Error(errorMessage));

      await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
      expect(listCompanyRepository.list).toHaveBeenCalledWith(input);
      expect(listCompanyRepository.list).toHaveBeenCalledTimes(1);
    });
  });
});

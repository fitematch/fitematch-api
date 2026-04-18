import { CreateCompanyUseCase } from '@src/modules/company/application/use-cases/create-company.use-case';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let createCompanyRepository: jest.Mocked<CreateCompanyRepositoryInterface>;

  beforeEach(() => {
    createCompanyRepository = {
      create: jest.fn(),
    } as jest.Mocked<CreateCompanyRepositoryInterface>;

    useCase = new CreateCompanyUseCase(createCompanyRepository);
  });

  describe('execute', () => {
    describe('when status is not provided', () => {
      it('should create a company with pending status by default', async () => {
        const input = {
          slug: 'umbrella-corp',
          tradeName: 'Umbrella Corp',
          legalName: 'Umbrella Corporation LTDA',
          contacts: {
            email: 'contact@umbrella.com',
            website: 'https://umbrella.com',
            phone: {
              countryCode: '+55',
              areaCode: '11',
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
            isVerified: false,
          },
          media: {
            logoUrl: 'https://cdn.example.com/umbrella.png',
          },
          audit: {
            createdByUserId: 'user-1',
          },
        };

        const expected = {
          ...input,
          id: 'company-1',
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          status: CompanyStatusEnum.PENDING,
        });
        expect(createCompanyRepository.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('when status is provided', () => {
      it('should use the informed status', async () => {
        const input = {
          slug: 'stars-labs',
          tradeName: 'S.T.A.R.S. Labs',
          contacts: {
            email: 'contact@starslabs.com',
            phone: {
              countryCode: '+1',
              areaCode: '212',
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
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.example.com/stars-labs.png',
          },
          approval: {
            approvedAt: new Date('2024-02-10T00:00:00.000Z'),
            approvedByUserId: 'admin-1',
          },
          status: CompanyStatusEnum.ACTIVE,
        };

        const expected = {
          ...input,
          id: 'company-2',
          createdAt: new Date('2024-02-01T00:00:00.000Z'),
          updatedAt: new Date('2024-02-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith(input);
        expect(createCompanyRepository.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('when repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          slug: 'error-company',
          tradeName: 'Error Company',
          contacts: {
            email: 'error@company.com',
            phone: {
              countryCode: '+55',
              areaCode: '11',
              number: '988887777',
            },
            address: {
              street: 'Rua A',
              number: '1',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01000-000',
            },
          },
          documents: {
            cnpj: '00.000.000/0001-00',
          },
          media: {},
        };

        const errorMessage = 'Repository error';

        createCompanyRepository.create.mockRejectedValue(
          new Error(errorMessage),
        );

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          status: CompanyStatusEnum.PENDING,
        });
        expect(createCompanyRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});

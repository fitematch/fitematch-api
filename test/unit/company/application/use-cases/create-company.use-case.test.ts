import { CreateCompanyUseCase } from '@src/modules/company/application/use-cases/create-company.use-case';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let createCompanyRepository: jest.Mocked<CreateCompanyRepositoryInterface>;

  beforeEach(() => {
    createCompanyRepository = {
      existsBySlug: jest.fn().mockResolvedValue(false),
      existsByCnpj: jest.fn().mockResolvedValue(false),
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
            cnpj: '11.222.333/0001-81',
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
          _id: 'company-1',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          slug: 'umbrella-corp',
          status: CompanyStatusEnum.PENDING,
        });
        expect(createCompanyRepository.create).toHaveBeenCalledTimes(1);
      });

      it('should generate the slug from trade name when the informed slug is empty', async () => {
        const input = {
          slug: '',
          tradeName: 'Umbrella Corp',
          contacts: {
            email: 'contact@umbrella.com',
            phone: {
              country: '+55',
              number: '999999999',
            },
            address: {
              street: 'Rua das Empresas',
              number: '1000',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-81',
          },
          media: {},
        };

        const expected = {
          ...input,
          _id: 'company-1',
          slug: 'umbrella-corp',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          slug: 'umbrella-corp',
          status: CompanyStatusEnum.PENDING,
        });
      });

      it('should generate the slug from trade name when slug is not provided', async () => {
        const input = {
          tradeName: 'Raccoon Fitness',
          contacts: {
            email: 'contact@raccoonfitness.com',
            phone: {
              country: '+55',
              number: '999999999',
            },
            address: {
              street: 'Rua das Academias',
              number: '321',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-81',
          },
          media: {},
        };

        const expected = {
          ...input,
          _id: 'company-3',
          slug: 'raccoon-fitness',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          slug: 'raccoon-fitness',
          status: CompanyStatusEnum.PENDING,
        });
      });

      it('should append a numeric suffix when the generated slug already exists', async () => {
        const input = {
          tradeName: 'Umbrella Corp',
          contacts: {
            email: 'contact@umbrella.com',
            phone: {
              country: '+55',
              number: '999999999',
            },
            address: {
              street: 'Rua das Empresas',
              number: '1000',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-81',
          },
          media: {},
        };

        const expected = {
          ...input,
          _id: 'company-4',
          slug: 'umbrella-corp-1',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createCompanyRepository.existsBySlug
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false);
        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.existsBySlug).toHaveBeenNthCalledWith(
          1,
          'umbrella-corp',
        );
        expect(createCompanyRepository.existsBySlug).toHaveBeenNthCalledWith(
          2,
          'umbrella-corp-1',
        );
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          slug: 'umbrella-corp-1',
          status: CompanyStatusEnum.PENDING,
        });
      });

      it('should throw conflict when a company with the same cnpj already exists', async () => {
        const input = {
          tradeName: 'Umbrella Corp',
          contacts: {
            email: 'contact@umbrella.com',
            phone: {
              country: '+55',
              number: '999999999',
            },
            address: {
              street: 'Rua das Empresas',
              number: '1000',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
          },
          documents: {
            cnpj: '11.222.333/0001-81',
          },
          media: {},
        };

        createCompanyRepository.existsByCnpj.mockResolvedValue(true);

        await expect(useCase.execute(input)).rejects.toThrow(
          'Company with this CNPJ already exists.',
        );
        expect(createCompanyRepository.existsByCnpj).toHaveBeenCalledWith(
          '11222333000181',
        );
        expect(createCompanyRepository.create).not.toHaveBeenCalled();
      });

      it('should throw bad request when the informed cnpj is invalid', async () => {
        const input = {
          tradeName: 'Umbrella Corp',
          contacts: {
            email: 'contact@umbrella.com',
            phone: {
              country: '+55',
              number: '999999999',
            },
            address: {
              street: 'Rua das Empresas',
              number: '1000',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01001-000',
            },
          },
          documents: {
            cnpj: '12.345.678/0001-91',
          },
          media: {},
        };

        await expect(useCase.execute(input)).rejects.toThrow('Invalid CNPJ.');
        expect(createCompanyRepository.existsByCnpj).not.toHaveBeenCalled();
        expect(createCompanyRepository.create).not.toHaveBeenCalled();
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
            cnpj: '11.444.777/0001-61',
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
          _id: 'company-2',
          documents: {
            ...input.documents,
            cnpj: '11444777000161',
          },
          createdAt: new Date('2024-02-01T00:00:00.000Z'),
          updatedAt: new Date('2024-02-02T00:00:00.000Z'),
        };

        createCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '11444777000161',
          },
          slug: 'stars-labs',
        });
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
              country: '+55',
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
            cnpj: '00.000.000/0001-91',
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
          documents: {
            ...input.documents,
            cnpj: '00000000000191',
          },
          slug: 'error-company',
          status: CompanyStatusEnum.PENDING,
        });
        expect(createCompanyRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});

import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateMyCompanyUseCase } from '@src/modules/company/application/use-cases/create-my-company.use-case';
import type { CreateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-my-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('CreateMyCompanyUseCase', () => {
  let useCase: CreateMyCompanyUseCase;
  let createMyCompanyRepository: jest.Mocked<CreateMyCompanyRepositoryInterface>;

  beforeEach(() => {
    createMyCompanyRepository = {
      existsBySlug: jest.fn().mockResolvedValue(false),
      existsByCnpj: jest.fn().mockResolvedValue(false),
      existsByCreatedByUserId: jest.fn().mockResolvedValue(false),
      create: jest.fn(),
    } as jest.Mocked<CreateMyCompanyRepositoryInterface>;

    useCase = new CreateMyCompanyUseCase(createMyCompanyRepository);
  });

  describe('execute', () => {
    describe('when the recruiter does not have a company yet', () => {
      it('should create a company with a normalized cnpj and informed slug', async () => {
        const input = {
          userId: 'user-1',
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
        };

        const expected = {
          ...input,
          _id: 'company-1',
          slug: 'umbrella-corp',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          audit: {
            createdByUserId: 'user-1',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        };

        createMyCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(
          createMyCompanyRepository.existsByCreatedByUserId,
        ).toHaveBeenCalledWith(input.userId);
        expect(createMyCompanyRepository.existsByCnpj).toHaveBeenCalledWith(
          '11222333000181',
        );
        expect(createMyCompanyRepository.existsBySlug).toHaveBeenCalledWith(
          'umbrella-corp',
        );
        expect(createMyCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'umbrella-corp',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
        });
      });

      it('should generate the slug from trade name when slug is empty', async () => {
        const input = {
          userId: 'user-2',
          slug: '',
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
          _id: 'company-2',
          slug: 'raccoon-fitness',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
        };

        createMyCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createMyCompanyRepository.existsBySlug).toHaveBeenCalledWith(
          'raccoon-fitness',
        );
        expect(createMyCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'raccoon-fitness',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
        });
      });

      it('should append a numeric suffix when the generated slug already exists', async () => {
        const input = {
          userId: 'user-3',
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
          _id: 'company-3',
          slug: 'umbrella-corp-1',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
          status: CompanyStatusEnum.PENDING,
        };

        createMyCompanyRepository.existsBySlug
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false);
        createMyCompanyRepository.create.mockResolvedValue(expected);

        const result = await useCase.execute(input);

        expect(result).toEqual(expected);
        expect(createMyCompanyRepository.existsBySlug).toHaveBeenNthCalledWith(
          1,
          'umbrella-corp',
        );
        expect(createMyCompanyRepository.existsBySlug).toHaveBeenNthCalledWith(
          2,
          'umbrella-corp-1',
        );
        expect(createMyCompanyRepository.create).toHaveBeenCalledWith({
          ...input,
          slug: 'umbrella-corp-1',
          documents: {
            ...input.documents,
            cnpj: '11222333000181',
          },
        });
      });
    });

    describe('when the recruiter already has a company', () => {
      it('should throw a conflict exception', async () => {
        const input = {
          userId: 'user-1',
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

        createMyCompanyRepository.existsByCreatedByUserId.mockResolvedValue(
          true,
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException(
            'Authenticated recruiter already has a company.',
          ),
        );
        expect(
          createMyCompanyRepository.existsByCreatedByUserId,
        ).toHaveBeenCalledWith(input.userId);
        expect(createMyCompanyRepository.existsByCnpj).not.toHaveBeenCalled();
        expect(createMyCompanyRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when cnpj is invalid', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          userId: 'user-1',
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
            cnpj: '11.222.333/0001-82',
          },
          media: {},
        };

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid CNPJ.'),
        );
        expect(createMyCompanyRepository.existsByCnpj).not.toHaveBeenCalled();
        expect(createMyCompanyRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when cnpj already exists', () => {
      it('should throw a conflict exception', async () => {
        const input = {
          userId: 'user-1',
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

        createMyCompanyRepository.existsByCnpj.mockResolvedValue(true);

        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException('Company with this CNPJ already exists.'),
        );
        expect(createMyCompanyRepository.existsByCnpj).toHaveBeenCalledWith(
          '11222333000181',
        );
        expect(createMyCompanyRepository.existsBySlug).not.toHaveBeenCalled();
        expect(createMyCompanyRepository.create).not.toHaveBeenCalled();
      });
    });
  });
});

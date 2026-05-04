import { ReadMyCompanyUseCase } from '@src/modules/company/application/use-cases/read-my-company.use-case';
import type { ReadMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-my-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('ReadMyCompanyUseCase', () => {
  let useCase: ReadMyCompanyUseCase;
  let readMyCompanyRepository: jest.Mocked<ReadMyCompanyRepositoryInterface>;

  beforeEach(() => {
    readMyCompanyRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadMyCompanyRepositoryInterface>;

    useCase = new ReadMyCompanyUseCase(readMyCompanyRepository);
  });

  describe('execute', () => {
    describe('when the company exists for the authenticated recruiter', () => {
      it('should return the company with all mapped fields', async () => {
        const input = { userId: 'user-1' };

        const output = {
          _id: 'company-id-1',
          slug: 'fitematch',
          tradeName: 'Fitematch',
          legalName: 'Fitematch Tecnologia Ltda',
          contacts: {
            email: 'contato@fitematch.com',
            website: 'https://fitematch.com',
            phone: {
              country: '+55',
              number: '11999999999',
              isWhatsapp: true,
              isTelegram: false,
            },
            address: {
              street: 'Rua A',
              number: '100',
              complement: 'Sala 501',
              neighborhood: 'Centro',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01000000',
            },
            social: {
              facebook: 'fitematchoficial',
              instagram: 'fitematch',
              linkedin: 'fitematch',
            },
          },
          documents: {
            cnpj: '12.345.678/0001-90',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.fitematch.com/logo.png',
          },
          audit: {
            createdByUserId: 'user-1',
          },
          approval: {
            approvedAt: new Date('2026-04-18T10:00:00.000Z'),
            approvedByUserId: 'admin-001',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-18T04:24:41.570Z'),
          updatedAt: new Date('2026-04-18T04:24:41.570Z'),
        };

        readMyCompanyRepository.read.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(readMyCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readMyCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the recruiter has no company', () => {
      it('should return null', async () => {
        const input = { userId: 'missing-user-id' };

        readMyCompanyRepository.read.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(readMyCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readMyCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { userId: 'error-user-id' };
        const errorMessage = 'Repository error';

        readMyCompanyRepository.read.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(readMyCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readMyCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });
  });
});

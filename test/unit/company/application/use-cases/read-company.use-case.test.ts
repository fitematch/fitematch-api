import { ReadCompanyUseCase } from '@src/modules/company/application/use-cases/read-company.use-case';
import type { ReadCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('ReadCompanyUseCase', () => {
  let useCase: ReadCompanyUseCase;
  let readCompanyRepository: jest.Mocked<ReadCompanyRepositoryInterface>;

  beforeEach(() => {
    readCompanyRepository = {
      read: jest.fn(),
    } as jest.Mocked<ReadCompanyRepositoryInterface>;

    useCase = new ReadCompanyUseCase(readCompanyRepository);
  });

  describe('execute', () => {
    describe('when the company exists', () => {
      it('should return the company with all mapped fields', async () => {
        const input = { id: 'company-id-1' };

        const output = {
          id: 'company-id-1',
          slug: 'fitematch',
          tradeName: 'Fitematch',
          legalName: 'Fitematch Tecnologia Ltda',
          contacts: {
            email: 'contato@fitematch.com',
            website: 'https://fitematch.com',
            phone: {
              countryCode: '+55',
              areaCode: '11',
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
              x: 'fitematch',
              youtube: 'fitematch',
              tiktok: 'fitematch',
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
            createdByUserId: 'user-admin-001',
          },
          approval: {
            approvedAt: new Date('2026-04-18T10:00:00.000Z'),
            approvedByUserId: 'admin-001',
          },
          status: CompanyStatusEnum.PENDING,
          createdAt: new Date('2026-04-18T04:24:41.570Z'),
          updatedAt: new Date('2026-04-18T04:24:41.570Z'),
        };

        readCompanyRepository.read.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(readCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the company does not exist', () => {
      it('should return null', async () => {
        const input = { id: 'missing-company-id' };

        readCompanyRepository.read.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(readCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = { id: 'error-company-id' };
        const errorMessage = 'Repository error';

        readCompanyRepository.read.mockRejectedValue(new Error(errorMessage));

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(readCompanyRepository.read).toHaveBeenCalledWith(input);
        expect(readCompanyRepository.read).toHaveBeenCalledTimes(1);
      });
    });
  });
});

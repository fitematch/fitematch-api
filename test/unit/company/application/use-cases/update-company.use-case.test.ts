import { UpdateCompanyUseCase } from '@src/modules/company/application/use-cases/update-company.use-case';
import type { UpdateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
  let updateCompanyRepository: jest.Mocked<UpdateCompanyRepositoryInterface>;

  beforeEach(() => {
    updateCompanyRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateCompanyRepositoryInterface>;

    useCase = new UpdateCompanyUseCase(updateCompanyRepository);
  });

  describe('execute', () => {
    describe('when the company exists', () => {
      it('should return the updated company with all fields', async () => {
        const input = {
          id: 'company-id-1',
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
          status: CompanyStatusEnum.ACTIVE,
        };

        const output = {
          ...input,
          createdAt: new Date('2026-04-18T04:24:41.570Z'),
          updatedAt: new Date('2026-04-18T05:24:41.570Z'),
        };

        updateCompanyRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the company does not exist', () => {
      it('should return null', async () => {
        const input = {
          id: 'missing-company-id',
          tradeName: 'Missing Company',
        };

        updateCompanyRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          id: 'error-company-id',
          tradeName: 'Error Company',
        };
        const errorMessage = 'Repository error';

        updateCompanyRepository.update.mockRejectedValue(
          new Error(errorMessage),
        );

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(updateCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

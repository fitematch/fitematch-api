import { BadRequestException } from '@nestjs/common';
import { UpdateMyCompanyUseCase } from '@src/modules/company/application/use-cases/update-my-company.use-case';
import type { UpdateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-my-company.repository.interface';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

describe('UpdateMyCompanyUseCase', () => {
  let useCase: UpdateMyCompanyUseCase;
  let updateMyCompanyRepository: jest.Mocked<UpdateMyCompanyRepositoryInterface>;

  beforeEach(() => {
    updateMyCompanyRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateMyCompanyRepositoryInterface>;

    useCase = new UpdateMyCompanyUseCase(updateMyCompanyRepository);
  });

  describe('execute', () => {
    describe('when a valid cnpj is provided', () => {
      it('should normalize the cnpj before updating the company', async () => {
        const input = {
          userId: 'user-1',
          tradeName: 'Fitematch',
          legalName: 'Fitematch Tecnologia Ltda',
          contacts: {
            email: 'contato@fitematch.com',
          },
          documents: {
            cnpj: '12.345.678/0001-95',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.fitematch.com/logo.png',
          },
        };

        const output = {
          _id: 'company-id-1',
          slug: 'fitematch',
          tradeName: 'Fitematch',
          legalName: 'Fitematch Tecnologia Ltda',
          contacts: {
            email: 'contato@fitematch.com',
            phone: {
              country: '+55',
              number: '11999999999',
            },
            address: {
              street: 'Rua A',
              number: '100',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01000000',
            },
          },
          documents: {
            cnpj: '12345678000195',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.fitematch.com/logo.png',
          },
          audit: {
            createdByUserId: 'user-1',
          },
          status: CompanyStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-18T04:24:41.570Z'),
          updatedAt: new Date('2026-04-18T05:24:41.570Z'),
        };

        updateMyCompanyRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledWith({
          ...input,
          documents: {
            ...input.documents,
            cnpj: '12345678000195',
          },
        });
        expect(updateMyCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when cnpj is not provided', () => {
      it('should update without changing the input payload', async () => {
        const input = {
          userId: 'user-2',
          tradeName: 'Fitematch Updated',
          media: {
            logoUrl: 'https://cdn.fitematch.com/new-logo.png',
          },
        };

        const output = {
          _id: 'company-id-2',
          slug: 'fitematch',
          tradeName: 'Fitematch Updated',
          contacts: {
            email: 'contato@fitematch.com',
            phone: {
              country: '+55',
              number: '11999999999',
            },
            address: {
              street: 'Rua A',
              number: '100',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '01000000',
            },
          },
          documents: {
            cnpj: '12345678000195',
            isVerified: true,
          },
          media: {
            logoUrl: 'https://cdn.fitematch.com/new-logo.png',
          },
          status: CompanyStatusEnum.ACTIVE,
        };

        updateMyCompanyRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the company does not exist', () => {
      it('should return null', async () => {
        const input = {
          userId: 'missing-user-id',
          tradeName: 'Missing Company',
        };

        updateMyCompanyRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateMyCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when cnpj is invalid', () => {
      it('should throw a bad request exception', async () => {
        const input = {
          userId: 'user-3',
          documents: {
            cnpj: '12.345.678/0001-90',
          },
        };

        await expect(useCase.execute(input)).rejects.toThrow(
          new BadRequestException('Invalid CNPJ.'),
        );
        expect(updateMyCompanyRepository.update).not.toHaveBeenCalled();
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          userId: 'error-user-id',
          tradeName: 'Error Company',
        };
        const errorMessage = 'Repository error';

        updateMyCompanyRepository.update.mockRejectedValue(
          new Error(errorMessage),
        );

        await expect(useCase.execute(input)).rejects.toThrow(errorMessage);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledWith(input);
        expect(updateMyCompanyRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

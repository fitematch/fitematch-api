import { DeleteCompanyUseCase } from '@src/modules/company/application/use-cases/delete-company.use-case';
import type { DeleteCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/delete-company.repository.interface';
import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';

describe('DeleteCompanyUseCase', () => {
  let useCase: DeleteCompanyUseCase;
  let deleteCompanyRepository: jest.Mocked<DeleteCompanyRepositoryInterface>;

  const input: DeleteCompanyInputDto = {
    id: 'company-id',
  };

  beforeEach(() => {
    deleteCompanyRepository = {
      delete: jest.fn(),
    } as jest.Mocked<DeleteCompanyRepositoryInterface>;

    useCase = new DeleteCompanyUseCase(deleteCompanyRepository);
  });

  describe('execute', () => {
    describe('when the company is deleted', () => {
      it('should return true', async () => {
        deleteCompanyRepository.delete.mockResolvedValue(true);

        const result = await useCase.execute(input);

        expect(result).toBe(true);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the company is not deleted', () => {
      it('should return false', async () => {
        deleteCompanyRepository.delete.mockResolvedValue(false);

        const result = await useCase.execute(input);

        expect(result).toBe(false);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the repository receives the request', () => {
      it('should call repository with the correct input', async () => {
        deleteCompanyRepository.delete.mockResolvedValue(true);

        await useCase.execute(input);

        expect(deleteCompanyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledWith({
          id: 'company-id',
        });
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const error = new Error('Repository error');

        deleteCompanyRepository.delete.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteCompanyRepository.delete).toHaveBeenCalledWith(input);
      });
    });
  });
});

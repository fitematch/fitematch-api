import { DeleteApplyUseCase } from '@src/modules/apply/application/use-cases/delete-apply.use-case';
import type { DeleteApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/delete-apply.repository.interface';
import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('DeleteApplyUseCase', () => {
  let useCase: DeleteApplyUseCase;
  let deleteApplyRepository: jest.Mocked<DeleteApplyRepositoryInterface>;
  const existingApply = {
    _id: 'apply-id',
    jobId: 'job-id',
    userId: 'user-id',
    status: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const input: DeleteApplyInputDto = {
    _id: 'apply-id',
    userId: 'user-id',
    productRole: ProductRoleEnum.CANDIDATE,
  };

  beforeEach(() => {
    deleteApplyRepository = {
      readById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<DeleteApplyRepositoryInterface>;

    useCase = new DeleteApplyUseCase(deleteApplyRepository);
  });

  describe('execute', () => {
    describe('when the application is deleted', () => {
      it('should return true', async () => {
        deleteApplyRepository.readById.mockResolvedValue(
          existingApply as never,
        );
        deleteApplyRepository.delete.mockResolvedValue(true);

        const result = await useCase.execute(input);

        expect(result).toBe(true);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the application is not deleted', () => {
      it('should return false', async () => {
        deleteApplyRepository.readById.mockResolvedValue(
          existingApply as never,
        );
        deleteApplyRepository.delete.mockResolvedValue(false);

        const result = await useCase.execute(input);

        expect(result).toBe(false);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    describe('when the repository receives the request', () => {
      it('should call repository with the correct input', async () => {
        deleteApplyRepository.readById.mockResolvedValue(
          existingApply as never,
        );
        deleteApplyRepository.delete.mockResolvedValue(true);

        await useCase.execute(input);

        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith({
          _id: 'apply-id',
          userId: 'user-id',
          productRole: ProductRoleEnum.CANDIDATE,
        });
      });
    });

    describe('when the repository throws an error', () => {
      it('should propagate the error', async () => {
        const error = new Error('Repository error');

        deleteApplyRepository.readById.mockResolvedValue(
          existingApply as never,
        );
        deleteApplyRepository.delete.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow(error);
        expect(deleteApplyRepository.delete).toHaveBeenCalledTimes(1);
        expect(deleteApplyRepository.delete).toHaveBeenCalledWith(input);
      });
    });

    it('throws when the apply does not exist', async () => {
      deleteApplyRepository.readById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
      expect(deleteApplyRepository.delete).not.toHaveBeenCalled();
    });

    it('throws when product role is not candidate', async () => {
      deleteApplyRepository.readById.mockResolvedValue(existingApply as never);

      await expect(
        useCase.execute({
          ...input,
          productRole: ProductRoleEnum.RECRUITER,
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(deleteApplyRepository.delete).not.toHaveBeenCalled();
    });

    it('throws when candidate does not own the apply', async () => {
      deleteApplyRepository.readById.mockResolvedValue(existingApply as never);

      await expect(
        useCase.execute({
          ...input,
          userId: 'other-user-id',
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(deleteApplyRepository.delete).not.toHaveBeenCalled();
    });
  });
});

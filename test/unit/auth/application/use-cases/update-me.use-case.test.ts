import type { UpdateMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/update-me.repository.interface';
import { UpdateMeUseCase } from '@src/modules/auth/application/use-cases/update-me.use-case';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

describe('UpdateMeUseCase', () => {
  let useCase: UpdateMeUseCase;
  let updateMeRepository: jest.Mocked<UpdateMeRepositoryInterface>;

  beforeEach(() => {
    updateMeRepository = {
      update: jest.fn(),
    } as jest.Mocked<UpdateMeRepositoryInterface>;

    useCase = new UpdateMeUseCase(updateMeRepository);
  });

  describe('execute', () => {
    describe('when the authenticated user exists', () => {
      it('should return the updated authenticated user profile', async () => {
        const input = {
          userId: 'user-1',
          name: 'Rebecca Chambers',
          birthday: '1998-07-29',
        };
        const output = {
          id: 'user-1',
          name: 'Rebecca Chambers',
          email: 'rebecca@fitematch.com',
          birthday: '1998-07-29',
          productRole: ProductRoleEnum.RECRUITER,
          status: UserStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-21T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        };

        updateMeRepository.update.mockResolvedValue(output);

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
        expect(updateMeRepository.update).toHaveBeenCalledWith(input);
      });
    });

    describe('when the authenticated user does not exist', () => {
      it('should return null', async () => {
        const input = {
          userId: 'missing-user',
          name: 'Missing User',
        };

        updateMeRepository.update.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result).toBeNull();
        expect(updateMeRepository.update).toHaveBeenCalledWith(input);
      });
    });
  });
});

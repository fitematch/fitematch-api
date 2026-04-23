import type { GetMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/get-me.repository.interface';
import { GetMeUseCase } from '@src/modules/auth/application/use-cases/get-me.use-case';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  let getMeRepository: jest.Mocked<GetMeRepositoryInterface>;

  beforeEach(() => {
    getMeRepository = {
      findById: jest.fn(),
    } as jest.Mocked<GetMeRepositoryInterface>;

    useCase = new GetMeUseCase(getMeRepository);
  });

  describe('execute', () => {
    describe('when the authenticated user exists', () => {
      it('should return the authenticated user profile', async () => {
        const output = {
          id: 'user-1',
          name: 'Rebecca Chambers',
          email: 'rebecca@fitematch.com',
          birthday: '1998-07-29',
          candidateProfile: {
            contacts: {
              phone: {
                country: '+55',
                number: '11999999999',
                isWhatsapp: true,
              },
            },
            availability: [AvailabilityShiftEnum.MORNING],
          },
          recruiterProfile: {
            position: 'Recruiter',
          },
          productRole: ProductRoleEnum.RECRUITER,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
          permissions: [PermissionEnum.CREATE_USERS],
          status: UserStatusEnum.ACTIVE,
          createdAt: new Date('2026-04-21T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        };

        getMeRepository.findById.mockResolvedValue(output);

        const result = await useCase.execute({ userId: 'user-1' });

        expect(result).toEqual(output);
        expect(getMeRepository.findById).toHaveBeenCalledWith('user-1');
      });
    });

    describe('when the authenticated user does not exist', () => {
      it('should return null', async () => {
        getMeRepository.findById.mockResolvedValue(null);

        const result = await useCase.execute({ userId: 'missing-user' });

        expect(result).toBeNull();
        expect(getMeRepository.findById).toHaveBeenCalledWith('missing-user');
      });
    });
  });
});

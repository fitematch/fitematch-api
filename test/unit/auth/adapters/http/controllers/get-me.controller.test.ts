import { NotFoundException } from '@nestjs/common';
import { GetMeController } from '@src/modules/auth/adapters/http/controllers/get-me.controller';
import type { GetMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/get-me.use-case.interface';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('GetMeController', () => {
  let controller: GetMeController;
  let getMeUseCase: jest.Mocked<GetMeUseCaseInterface>;

  beforeEach(() => {
    getMeUseCase = {
      execute: jest.fn(),
    } as jest.Mocked<GetMeUseCaseInterface>;

    controller = new GetMeController(getMeUseCase);
  });

  describe('handle', () => {
    describe('when the authenticated user exists', () => {
      it('should return the mapped authenticated user profile', async () => {
        const user = {
          id: 'user-1',
          email: 'rebecca@fitematch.com',
          productRole: ProductRoleEnum.RECRUITER,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
          permissions: [PermissionEnum.CREATE_USERS],
        };
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

        getMeUseCase.execute.mockResolvedValue(output);

        const result = await controller.handle(user);

        expect(result).toEqual({
          ...output,
          birthday: '29/07/1998',
          candidateProfile: {
            ...output.candidateProfile,
            contacts: {
              ...output.candidateProfile.contacts,
              phone: {
                ...output.candidateProfile.contacts.phone,
                number: '(11) 99999-9999',
              },
            },
          },
        });
        expect(getMeUseCase.execute).toHaveBeenCalledWith({
          userId: user.id,
        });
      });
    });

    describe('when the authenticated user is not found', () => {
      it('should throw a not found exception', async () => {
        getMeUseCase.execute.mockResolvedValue(null);

        await expect(
          controller.handle({
            id: 'missing-user',
            email: 'missing@fitematch.com',
            productRole: ProductRoleEnum.RECRUITER,
          }),
        ).rejects.toThrow(
          new NotFoundException('Authenticated user not found.'),
        );
        expect(getMeUseCase.execute).toHaveBeenCalledWith({
          userId: 'missing-user',
        });
      });
    });
  });
});

import { GetMeMapper } from '@src/modules/auth/adapters/http/mappers/get-me.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('GetMeMapper', () => {
  describe('toResponse', () => {
    it('should map the authenticated user profile to the response dto', () => {
      const user = {
        id: 'user-1',
        name: 'Rebecca Chambers',
        email: 'rebecca@fitematch.com',
        birthday: '1998-07-29',
        productRole: ProductRoleEnum.RECRUITER,
        adminRole: AdminRoleEnum.SUPER_ADMIN,
        permissions: [PermissionEnum.MANAGE_USERS],
        status: UserStatusEnum.ACTIVE,
        createdAt: new Date('2026-04-21T12:00:00.000Z'),
        updatedAt: new Date('2026-04-22T12:00:00.000Z'),
      };

      const result = GetMeMapper.toResponse(user);

      expect(result).toEqual(user);
    });
  });
});

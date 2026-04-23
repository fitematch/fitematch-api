import { SignUpMapper } from '@src/modules/auth/adapters/http/mappers/sign-up.mapper';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

describe('SignUpMapper', () => {
  describe('toResponse', () => {
    it('should map sign up output to response formatting birthday', () => {
      const user = {
        id: 'user-1',
        name: 'Rebecca Chambers',
        email: 'candidate@fitematch.com',
        birthday: '1998-07-29',
        productRole: ProductRoleEnum.CANDIDATE,
        status: UserStatusEnum.PENDING,
        createdAt: new Date('2026-04-21T12:00:00.000Z'),
        updatedAt: new Date('2026-04-22T12:00:00.000Z'),
      };

      const result = SignUpMapper.toResponse(user);

      expect(result).toEqual({
        ...user,
        birthday: '29/07/1998',
      });
    });
  });
});

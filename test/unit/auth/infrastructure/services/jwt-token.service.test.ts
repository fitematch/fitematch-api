import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '@src/modules/auth/infrastructure/services/jwt-token.service';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new JwtTokenService(jwtService);
  });

  describe('generateAccessToken', () => {
    it('should delegate token generation to JwtService with the informed payload', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
        productRole: ProductRoleEnum.RECRUITER,
        adminRole: AdminRoleEnum.SUPER_ADMIN,
        permissions: [PermissionEnum.MANAGE_USERS],
      };

      jwtService.signAsync.mockResolvedValue('access-token');

      const result = await service.generateAccessToken(payload);

      expect(result).toBe('access-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });

    it('should propagate JwtService errors', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      jwtService.signAsync.mockRejectedValue(new Error('jwt failure'));

      await expect(service.generateAccessToken(payload)).rejects.toThrow(
        'jwt failure',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });
  });
});

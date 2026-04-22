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
      verifyAsync: jest.fn(),
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
        permissions: [PermissionEnum.CREATE_USERS],
      };

      jwtService.signAsync.mockResolvedValue('access-token');

      const result = await service.generateAccessToken(payload);

      expect(result).toBe('access-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'default_jwt_secret',
        expiresIn: '1d',
      });
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
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'default_jwt_secret',
        expiresIn: '1d',
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should delegate refresh token generation with refresh secret and expiration', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      jwtService.signAsync.mockResolvedValue('refresh-token');

      const result = await service.generateRefreshToken(payload);

      expect(result).toBe('refresh-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'default_jwt_refresh_secret',
        expiresIn: '7d',
      });
    });

    it('should propagate JwtService refresh token errors', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      jwtService.signAsync.mockRejectedValue(new Error('jwt refresh failure'));

      await expect(service.generateRefreshToken(payload)).rejects.toThrow(
        'jwt refresh failure',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'default_jwt_refresh_secret',
        expiresIn: '7d',
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should delegate refresh token verification with refresh secret', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      jwtService.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyRefreshToken('refresh-token');

      expect(result).toEqual(payload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh-token', {
        secret: 'default_jwt_refresh_secret',
      });
    });

    it('should propagate JwtService verify errors', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt verify failure'));

      await expect(service.verifyRefreshToken('refresh-token')).rejects.toThrow(
        'jwt verify failure',
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh-token', {
        secret: 'default_jwt_refresh_secret',
      });
    });
  });
});

import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '@src/modules/auth/infrastructure/services/jwt-token.service';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let jwtService: jest.Mocked<JwtService>;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new JwtTokenService(jwtService);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    jest.resetModules();
    jest.dontMock('@nestjs/jwt');
  });

  describe('module metadata', () => {
    it('should load the service module even when JwtService metadata falls back', () => {
      jest.isolateModules(() => {
        jest.doMock('@nestjs/jwt', () => ({}));

        const moduleRef = jest.requireActual(
          '@src/modules/auth/infrastructure/services/jwt-token.service',
        );

        expect(moduleRef.JwtTokenService).toBeDefined();
      });
    });
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

    it('should use custom access token secret and expiration from env', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      process.env.JWT_SECRET = 'custom-secret';
      process.env.JWT_EXPIRES_IN = '12h';
      jwtService.signAsync.mockResolvedValue('access-token');

      await service.generateAccessToken(payload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'custom-secret',
        expiresIn: '12h',
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

    it('should use custom refresh token secret and expiration from env', async () => {
      const payload = {
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      };

      process.env.JWT_REFRESH_SECRET = 'custom-refresh-secret';
      process.env.JWT_REFRESH_EXPIRES_IN = '30d';
      jwtService.signAsync.mockResolvedValue('refresh-token');

      await service.generateRefreshToken(payload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'custom-refresh-secret',
        expiresIn: '30d',
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

    it('should use custom refresh token secret from env during verification', async () => {
      process.env.JWT_REFRESH_SECRET = 'custom-refresh-secret';
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      });

      await service.verifyRefreshToken('refresh-token');

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh-token', {
        secret: 'custom-refresh-secret',
      });
    });
  });

  describe('getRefreshTokenExpiresAt', () => {
    it('should calculate expiration date using the configured amount of days', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2026-04-22T12:00:00.000Z').getTime());
      process.env.JWT_REFRESH_EXPIRES_IN = '10d';

      const result = service.getRefreshTokenExpiresAt();

      expect(result).toEqual(new Date('2026-05-02T12:00:00.000Z'));
    });

    it('should fallback to 7 days when the configured expiration is not in days', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2026-04-22T12:00:00.000Z').getTime());
      process.env.JWT_REFRESH_EXPIRES_IN = '12h';

      const result = service.getRefreshTokenExpiresAt();

      expect(result).toEqual(new Date('2026-04-29T12:00:00.000Z'));
    });
  });
});

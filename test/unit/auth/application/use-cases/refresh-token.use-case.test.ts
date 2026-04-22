import { UnauthorizedException } from '@nestjs/common';
import type { RefreshTokenRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/refresh-token.repository.interface';
import type { TokenServiceInterface } from '@src/modules/auth/application/contracts/services/token.service.interface';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
    refreshTokenRepository = {
      findById: jest.fn(),
    } as jest.Mocked<RefreshTokenRepositoryInterface>;
    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    useCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService);
  });

  describe('execute', () => {
    describe('when the refresh token is valid', () => {
      it('should generate a new access token and refresh token', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };
        const payload = {
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        };
        const user = {
          id: 'user-1',
          email: payload.email,
          productRole: ProductRoleEnum.RECRUITER,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
          permissions: [PermissionEnum.CREATE_USERS],
          status: 'active',
        };

        tokenService.verifyRefreshToken.mockResolvedValue(payload);
        refreshTokenRepository.findById.mockResolvedValue(user);
        tokenService.generateAccessToken.mockResolvedValue('new-access-token');
        tokenService.generateRefreshToken.mockResolvedValue(
          'new-refresh-token',
        );

        const result = await useCase.execute(input);

        expect(result).toEqual({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        });
        expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
          input.refreshToken,
        );
        expect(refreshTokenRepository.findById).toHaveBeenCalledWith(
          payload.sub,
        );
        expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
          sub: user.id,
          email: user.email,
          productRole: user.productRole,
          adminRole: user.adminRole,
          permissions: user.permissions,
        });
        expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
          sub: user.id,
          email: user.email,
        });
      });
    });

    describe('when refresh token verification fails', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          refreshToken: 'invalid-refresh-token',
        };

        tokenService.verifyRefreshToken.mockRejectedValue(
          new Error('Invalid token'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid refresh token.'),
        );
        expect(refreshTokenRepository.findById).not.toHaveBeenCalled();
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
        expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
      });
    });

    describe('when the user from refresh token does not exist', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };

        tokenService.verifyRefreshToken.mockResolvedValue({
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        });
        refreshTokenRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid refresh token.'),
        );
        expect(refreshTokenRepository.findById).toHaveBeenCalledWith('user-1');
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
        expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
      });
    });

    describe('when access token generation fails', () => {
      it('should propagate the error', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };

        tokenService.verifyRefreshToken.mockResolvedValue({
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        });
        refreshTokenRepository.findById.mockResolvedValue({
          id: 'user-1',
          email: 'rebecca@fitematch.com',
          productRole: ProductRoleEnum.RECRUITER,
          status: 'active',
        });
        tokenService.generateAccessToken.mockRejectedValue(
          new Error('Token service error'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          'Token service error',
        );
        expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
      });
    });
  });
});

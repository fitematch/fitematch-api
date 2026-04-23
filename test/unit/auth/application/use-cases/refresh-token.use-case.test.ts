import { UnauthorizedException } from '@nestjs/common';
import type { RefreshTokenRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/refresh-token.repository.interface';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { TokenServiceInterface } from '@src/modules/auth/application/contracts/services/token.service.interface';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let sessionRepository: jest.Mocked<SessionRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
    refreshTokenRepository = {
      findById: jest.fn(),
    } as jest.Mocked<RefreshTokenRepositoryInterface>;
    sessionRepository = {
      create: jest.fn(),
      findValidByUserId: jest.fn(),
      findValidByHash: jest.fn(),
      revokeById: jest.fn(),
      revokeAllByUserId: jest.fn(),
    } as jest.Mocked<SessionRepositoryInterface>;
    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<HashServiceInterface>;
    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      getRefreshTokenExpiresAt: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      sessionRepository,
      hashService,
      tokenService,
    );
  });

  describe('execute', () => {
    describe('when the refresh token is valid', () => {
      it('should revoke the current session and generate a new token pair', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };
        const payload = {
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        };
        const session = {
          id: 'session-1',
          userId: payload.sub,
          refreshTokenHash: 'hashed-refresh-token',
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
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
        sessionRepository.findValidByUserId.mockResolvedValue(session);
        hashService.compare.mockResolvedValue(true);
        refreshTokenRepository.findById.mockResolvedValue(user);
        sessionRepository.revokeById.mockResolvedValue();
        tokenService.generateAccessToken.mockResolvedValue('new-access-token');
        tokenService.generateRefreshToken.mockResolvedValue(
          'new-refresh-token',
        );
        hashService.hash.mockResolvedValue('new-hashed-refresh-token');
        tokenService.getRefreshTokenExpiresAt.mockReturnValue(
          new Date('2026-04-30T12:00:00.000Z'),
        );
        sessionRepository.create.mockResolvedValue({
          id: 'session-2',
          userId: user.id,
          refreshTokenHash: 'new-hashed-refresh-token',
          expiresAt: new Date('2026-04-30T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-22T12:10:00.000Z'),
          updatedAt: new Date('2026-04-22T12:10:00.000Z'),
        });

        const result = await useCase.execute(input);

        expect(result).toEqual({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        });
        expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
          input.refreshToken,
        );
        expect(sessionRepository.findValidByUserId).toHaveBeenCalledWith(
          payload.sub,
        );
        expect(hashService.compare).toHaveBeenCalledWith(
          input.refreshToken,
          session.refreshTokenHash,
        );
        expect(refreshTokenRepository.findById).toHaveBeenCalledWith(
          payload.sub,
        );
        expect(sessionRepository.revokeById).toHaveBeenCalledWith(session.id);
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
        expect(hashService.hash).toHaveBeenCalledWith('new-refresh-token');
        expect(sessionRepository.create).toHaveBeenCalledWith({
          userId: user.id,
          refreshTokenHash: 'new-hashed-refresh-token',
          expiresAt: new Date('2026-04-30T12:00:00.000Z'),
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
        expect(sessionRepository.findValidByUserId).not.toHaveBeenCalled();
        expect(refreshTokenRepository.findById).not.toHaveBeenCalled();
      });
    });

    describe('when there is no valid session', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };

        tokenService.verifyRefreshToken.mockResolvedValue({
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        });
        sessionRepository.findValidByUserId.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid refresh token.'),
        );
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(refreshTokenRepository.findById).not.toHaveBeenCalled();
      });
    });

    describe('when the refresh token does not match the session hash', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          refreshToken: 'valid-refresh-token',
        };

        tokenService.verifyRefreshToken.mockResolvedValue({
          sub: 'user-1',
          email: 'rebecca@fitematch.com',
        });
        sessionRepository.findValidByUserId.mockResolvedValue({
          id: 'session-1',
          userId: 'user-1',
          refreshTokenHash: 'hashed-refresh-token',
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });
        hashService.compare.mockResolvedValue(false);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid refresh token.'),
        );
        expect(refreshTokenRepository.findById).not.toHaveBeenCalled();
        expect(sessionRepository.revokeById).not.toHaveBeenCalled();
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
        sessionRepository.findValidByUserId.mockResolvedValue({
          id: 'session-1',
          userId: 'user-1',
          refreshTokenHash: 'hashed-refresh-token',
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });
        hashService.compare.mockResolvedValue(true);
        refreshTokenRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid refresh token.'),
        );
        expect(sessionRepository.revokeById).not.toHaveBeenCalled();
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
      });
    });
  });
});

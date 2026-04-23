import { UnauthorizedException } from '@nestjs/common';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { TokenServiceInterface } from '@src/modules/auth/application/contracts/services/token.service.interface';
import { SignOutUseCase } from '@src/modules/auth/application/use-cases/sign-out.use-case';

describe('SignOutUseCase', () => {
  let useCase: SignOutUseCase;
  let sessionRepository: jest.Mocked<SessionRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
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

    useCase = new SignOutUseCase(sessionRepository, hashService, tokenService);
  });

  describe('execute', () => {
    it('should revoke the session and return a success message', async () => {
      const input = {
        refreshToken: 'refresh-token',
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
      sessionRepository.revokeById.mockResolvedValue();

      const result = await useCase.execute(input);

      expect(result).toEqual({
        message: 'Signed out successfully!',
      });
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
        input.refreshToken,
      );
      expect(sessionRepository.findValidByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(hashService.compare).toHaveBeenCalledWith(
        input.refreshToken,
        'hashed-refresh-token',
      );
      expect(sessionRepository.revokeById).toHaveBeenCalledWith('session-1');
    });

    it('should throw unauthorized when the token is invalid', async () => {
      tokenService.verifyRefreshToken.mockRejectedValue(new Error('Invalid'));

      await expect(
        useCase.execute({ refreshToken: 'invalid-refresh-token' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid refresh token.'));
      expect(sessionRepository.findValidByUserId).not.toHaveBeenCalled();
      expect(sessionRepository.revokeById).not.toHaveBeenCalled();
    });

    it('should throw unauthorized when there is no active session', async () => {
      tokenService.verifyRefreshToken.mockResolvedValue({
        sub: 'user-1',
        email: 'rebecca@fitematch.com',
      });
      sessionRepository.findValidByUserId.mockResolvedValue(null);

      await expect(
        useCase.execute({ refreshToken: 'refresh-token' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid refresh token.'));
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(sessionRepository.revokeById).not.toHaveBeenCalled();
    });

    it('should throw unauthorized when the refresh token does not match the stored hash', async () => {
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

      await expect(
        useCase.execute({ refreshToken: 'refresh-token' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid refresh token.'));
      expect(sessionRepository.revokeById).not.toHaveBeenCalled();
    });
  });
});

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RevokeAuthSessionUseCase } from '@src/modules/auth/application/use-cases/revoke-auth-session.use-case';
import type { RevokeAuthSessionRepository } from '@src/modules/auth/application/contracts/repositories/revoke-auth-session.repository';

describe('RevokeAuthSessionUseCase', () => {
  let useCase: RevokeAuthSessionUseCase;
  let repository: jest.Mocked<RevokeAuthSessionRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      revokeById: jest.fn(),
    } as jest.Mocked<RevokeAuthSessionRepository>;

    useCase = new RevokeAuthSessionUseCase(repository);
  });

  describe('execute', () => {
    it('should revoke the session when it belongs to the authenticated user', async () => {
      const input = {
        sessionId: 'session-1',
        userId: 'user-1',
      };

      repository.findById.mockResolvedValue({
        id: 'session-1',
        userId: 'user-1',
        refreshTokenHash: 'hash-1',
        userAgent: 'Chrome on Mac',
        ipAddress: '192.168.0.10',
        expiresAt: new Date('2026-04-29T12:00:00.000Z'),
        revokedAt: undefined,
        createdAt: new Date('2026-04-28T10:00:00.000Z'),
        updatedAt: new Date('2026-04-28T10:30:00.000Z'),
      });
      repository.revokeById.mockResolvedValue();

      await expect(useCase.execute(input)).resolves.toBeUndefined();
      expect(repository.findById).toHaveBeenCalledWith(input.sessionId);
      expect(repository.revokeById).toHaveBeenCalledWith(input.sessionId);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.revokeById).toHaveBeenCalledTimes(1);
    });

    it('should throw not found when the session does not exist', async () => {
      const input = {
        sessionId: 'missing-session',
        userId: 'user-1',
      };

      repository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundException('Session not found.'),
      );
      expect(repository.findById).toHaveBeenCalledWith(input.sessionId);
      expect(repository.revokeById).not.toHaveBeenCalled();
    });

    it('should throw forbidden when the session belongs to another user', async () => {
      const input = {
        sessionId: 'session-2',
        userId: 'user-1',
      };

      repository.findById.mockResolvedValue({
        id: 'session-2',
        userId: 'user-2',
        refreshTokenHash: 'hash-2',
        userAgent: 'Safari on iPhone',
        ipAddress: '10.0.0.15',
        expiresAt: new Date('2026-04-30T12:00:00.000Z'),
        revokedAt: undefined,
        createdAt: new Date('2026-04-28T11:00:00.000Z'),
        updatedAt: new Date('2026-04-28T11:20:00.000Z'),
      });

      await expect(useCase.execute(input)).rejects.toThrow(
        new ForbiddenException('You are not allowed to revoke this session.'),
      );
      expect(repository.findById).toHaveBeenCalledWith(input.sessionId);
      expect(repository.revokeById).not.toHaveBeenCalled();
    });

    it('should propagate repository errors from revokeById', async () => {
      const input = {
        sessionId: 'session-3',
        userId: 'user-3',
      };
      const error = new Error('Repository error');

      repository.findById.mockResolvedValue({
        id: 'session-3',
        userId: 'user-3',
        refreshTokenHash: 'hash-3',
        expiresAt: new Date('2026-05-01T12:00:00.000Z'),
      });
      repository.revokeById.mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow(error);
      expect(repository.findById).toHaveBeenCalledWith(input.sessionId);
      expect(repository.revokeById).toHaveBeenCalledWith(input.sessionId);
    });
  });
});

import { ListAuthSessionsUseCase } from '@src/modules/auth/application/use-cases/list-auth-sessions.use-case';
import type { ListAuthSessionsRepository } from '@src/modules/auth/application/contracts/repositories/list-auth-sessions.repository';

describe('ListAuthSessionsUseCase', () => {
  let useCase: ListAuthSessionsUseCase;
  let repository: jest.Mocked<ListAuthSessionsRepository>;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
    } as jest.Mocked<ListAuthSessionsRepository>;

    useCase = new ListAuthSessionsUseCase(repository);
  });

  describe('execute', () => {
    it('should return the mapped list of sessions', async () => {
      const input = {
        userId: 'user-1',
      };

      const sessions = [
        {
          id: 'session-1',
          userId: 'user-1',
          refreshTokenHash: 'hash-1',
          userAgent: 'Chrome on Mac',
          ipAddress: '192.168.0.10',
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-28T10:00:00.000Z'),
          updatedAt: new Date('2026-04-28T10:30:00.000Z'),
        },
        {
          id: 'session-2',
          userId: 'user-1',
          refreshTokenHash: 'hash-2',
          userAgent: 'Safari on iPhone',
          ipAddress: '10.0.0.15',
          expiresAt: new Date('2026-04-30T12:00:00.000Z'),
          revokedAt: new Date('2026-04-28T11:30:00.000Z'),
          createdAt: new Date('2026-04-28T11:00:00.000Z'),
          updatedAt: new Date('2026-04-28T11:30:00.000Z'),
        },
      ];

      repository.findByUserId.mockResolvedValue(sessions);

      const result = await useCase.execute(input);

      expect(result).toEqual([
        {
          id: 'session-1',
          userId: 'user-1',
          userAgent: 'Chrome on Mac',
          ipAddress: '192.168.0.10',
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-28T10:00:00.000Z'),
          updatedAt: new Date('2026-04-28T10:30:00.000Z'),
        },
        {
          id: 'session-2',
          userId: 'user-1',
          userAgent: 'Safari on iPhone',
          ipAddress: '10.0.0.15',
          expiresAt: new Date('2026-04-30T12:00:00.000Z'),
          revokedAt: new Date('2026-04-28T11:30:00.000Z'),
          createdAt: new Date('2026-04-28T11:00:00.000Z'),
          updatedAt: new Date('2026-04-28T11:30:00.000Z'),
        },
      ]);
      expect(repository.findByUserId).toHaveBeenCalledWith(input.userId);
      expect(repository.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no sessions are found', async () => {
      const input = {
        userId: 'missing-user',
      };

      repository.findByUserId.mockResolvedValue([]);

      const result = await useCase.execute(input);

      expect(result).toEqual([]);
      expect(repository.findByUserId).toHaveBeenCalledWith(input.userId);
      expect(repository.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const input = {
        userId: 'user-error',
      };
      const error = new Error('Repository error');

      repository.findByUserId.mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow(error);
      expect(repository.findByUserId).toHaveBeenCalledWith(input.userId);
      expect(repository.findByUserId).toHaveBeenCalledTimes(1);
    });
  });
});

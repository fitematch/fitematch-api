import type { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';

export interface SessionRepositoryInterface {
  create(
    input: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SessionEntity>;
  findValidByUserId(userId: string): Promise<SessionEntity | null>;
  findValidByHash(
    userId: string,
    refreshTokenHash: string,
  ): Promise<SessionEntity | null>;
  revokeById(id: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}

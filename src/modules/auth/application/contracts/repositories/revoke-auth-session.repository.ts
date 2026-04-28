import { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';

export interface RevokeAuthSessionRepository {
  findById(sessionId: string): Promise<SessionEntity | null>;
  revokeById(sessionId: string): Promise<void>;
}

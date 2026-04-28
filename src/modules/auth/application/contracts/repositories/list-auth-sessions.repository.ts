import { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';

export interface ListAuthSessionsRepository {
  findByUserId(userId: string): Promise<SessionEntity[]>;
}

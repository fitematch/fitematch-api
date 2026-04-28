import { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';
import { SessionDocument } from '@src/modules/auth/infrastructure/database/mongoose/schemas/session.schema';

export class SessionDatabaseMapper {
  static toEntity(document: SessionDocument): SessionEntity {
    return {
      id: document._id.toString(),
      userId: document.userId,
      refreshTokenHash: document.refreshTokenHash,
      userAgent: document.userAgent,
      ipAddress: document.ipAddress,
      expiresAt: document.expiresAt,
      revokedAt: document.revokedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

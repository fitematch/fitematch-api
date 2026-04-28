import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { RevokeAuthSessionRepository as RevokeAuthSessionRepositoryContract } from '@src/modules/auth/application/contracts/repositories/revoke-auth-session.repository';
import type { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';
import {
  SessionSchema,
  SessionDocument,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/session.schema';
import { SessionDatabaseMapper } from '@src/modules/auth/infrastructure/database/mappers/session-database.mapper';

@Injectable()
export class RevokeAuthSessionRepository implements RevokeAuthSessionRepositoryContract {
  constructor(
    @InjectModel(SessionSchema.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async findById(sessionId: string): Promise<SessionEntity | null> {
    const session = await this.sessionModel.findById(sessionId).exec();

    if (!session) {
      return null;
    }

    return SessionDatabaseMapper.toEntity(session);
  }

  async revokeById(sessionId: string): Promise<void> {
    await this.sessionModel
      .findByIdAndUpdate(sessionId, {
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .exec();
  }
}

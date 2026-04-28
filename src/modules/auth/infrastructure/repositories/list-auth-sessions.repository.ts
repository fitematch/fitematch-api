import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { ListAuthSessionsRepository as ListAuthSessionsRepositoryContract } from '@src/modules/auth/application/contracts/repositories/list-auth-sessions.repository';
import type { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';
import {
  SessionSchema,
  SessionDocument,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/session.schema';
import { SessionDatabaseMapper } from '@src/modules/auth/infrastructure/database/mappers/session-database.mapper';

@Injectable()
export class ListAuthSessionsRepository implements ListAuthSessionsRepositoryContract {
  constructor(
    @InjectModel(SessionSchema.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    const sessions = await this.sessionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return sessions.map((session) => SessionDatabaseMapper.toEntity(session));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { SessionEntity } from '@src/modules/auth/domain/entities/session.entity';
import {
  SessionSchema,
  type SessionDocument,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/session.schema';

@Injectable()
export class SessionRepository implements SessionRepositoryInterface {
  constructor(
    @InjectModel(SessionSchema.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  public async create(
    input: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SessionEntity> {
    const created = await this.sessionModel.create({
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt: input.expiresAt,
      revokedAt: input.revokedAt,
    });

    return {
      id: created._id.toString(),
      userId: created.userId,
      refreshTokenHash: created.refreshTokenHash,
      userAgent: created.userAgent,
      ipAddress: created.ipAddress,
      expiresAt: created.expiresAt,
      revokedAt: created.revokedAt,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  public async findValidByUserId(
    userId: string,
  ): Promise<SessionEntity | null> {
    const session = await this.sessionModel
      .findOne({
        userId,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!session) return null;

    return {
      id: session._id.toString(),
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  public async findValidByHash(
    userId: string,
    refreshTokenHash: string,
  ): Promise<SessionEntity | null> {
    const session = await this.sessionModel
      .findOne({
        userId,
        refreshTokenHash,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .lean()
      .exec();

    if (!session) return null;

    return {
      id: session._id.toString(),
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  public async revokeById(id: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(id, {
      revokedAt: new Date(),
    });
  }

  public async revokeAllByUserId(userId: string): Promise<void> {
    await this.sessionModel.updateMany(
      {
        userId,
        revokedAt: { $exists: false },
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );
  }
}

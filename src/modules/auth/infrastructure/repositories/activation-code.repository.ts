import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  ActivationCodeSchema,
  type ActivationCodeDocument,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/activation-code.schema';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { ActivationCodeEntity } from '@src/modules/auth/domain/entities/activation-code.entity';
import type { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

@Injectable()
export class ActivationCodeRepository implements ActivationCodeRepositoryInterface {
  constructor(
    @InjectModel(ActivationCodeSchema.name)
    private readonly activationCodeModel: Model<ActivationCodeDocument>,
  ) {}

  public async invalidateActiveCodes(
    userId: string,
    type: ActivationCodeTypeEnum,
  ): Promise<void> {
    await this.activationCodeModel.updateMany(
      {
        userId,
        type,
        usedAt: { $exists: false },
      },
      {
        $set: {
          usedAt: new Date(),
        },
      },
    );
  }

  public async create(
    input: Omit<ActivationCodeEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ActivationCodeEntity> {
    const createdCode = await this.activationCodeModel.create({
      userId: input.userId,
      codeHash: input.codeHash,
      type: input.type,
      expiresAt: input.expiresAt,
      usedAt: input.usedAt,
      attemptsCount: input.attemptsCount,
      maxAttempts: input.maxAttempts,
    });

    const timestamps = createdCode as unknown as {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: createdCode._id.toString(),
      userId: createdCode.userId,
      codeHash: createdCode.codeHash,
      type: createdCode.type,
      expiresAt: createdCode.expiresAt,
      usedAt: createdCode.usedAt,
      attemptsCount: createdCode.attemptsCount,
      maxAttempts: createdCode.maxAttempts,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }

  public async findActiveCodeByUserIdAndType(
    userId: string,
    type: ActivationCodeTypeEnum,
  ): Promise<ActivationCodeEntity | null> {
    const activationCode = await this.activationCodeModel
      .findOne({
        userId,
        type,
        usedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!activationCode) {
      return null;
    }

    return {
      id: activationCode._id.toString(),
      userId: activationCode.userId,
      codeHash: activationCode.codeHash,
      type: activationCode.type,
      expiresAt: activationCode.expiresAt,
      usedAt: activationCode.usedAt,
      attemptsCount: activationCode.attemptsCount,
      maxAttempts: activationCode.maxAttempts,
      createdAt: activationCode.createdAt,
      updatedAt: activationCode.updatedAt,
    };
  }

  public async incrementAttempts(id: string): Promise<void> {
    await this.activationCodeModel.findByIdAndUpdate(id, {
      $inc: {
        attemptsCount: 1,
      },
    });
  }

  public async markAsUsed(id: string): Promise<void> {
    await this.activationCodeModel.findByIdAndUpdate(id, {
      usedAt: new Date(),
    });
  }
}

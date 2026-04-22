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
      code: input.code,
      type: input.type,
      expiresAt: input.expiresAt,
      usedAt: input.usedAt,
    });

    const timestamps = createdCode as unknown as {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: createdCode._id.toString(),
      userId: createdCode.userId,
      code: createdCode.code,
      type: createdCode.type,
      expiresAt: createdCode.expiresAt,
      usedAt: createdCode.usedAt,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }

  public async findValidCode(
    userId: string,
    code: string,
    type: ActivationCodeTypeEnum,
  ): Promise<ActivationCodeEntity | null> {
    const activationCode = await this.activationCodeModel
      .findOne({
        userId,
        code,
        type,
        usedAt: { $exists: false },
      })
      .lean()
      .exec();

    if (!activationCode) {
      return null;
    }

    return {
      id: activationCode._id.toString(),
      userId: activationCode.userId,
      code: activationCode.code,
      type: activationCode.type,
      expiresAt: activationCode.expiresAt,
      usedAt: activationCode.usedAt,
      createdAt: activationCode.createdAt,
      updatedAt: activationCode.updatedAt,
    };
  }

  public async markAsUsed(id: string): Promise<void> {
    await this.activationCodeModel.findByIdAndUpdate(id, {
      usedAt: new Date(),
    });
  }
}

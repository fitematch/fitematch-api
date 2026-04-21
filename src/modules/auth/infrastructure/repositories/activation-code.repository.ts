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

  async invalidateActiveCodes(
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

  async create(
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
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { ListMyAppliesRepository as ListMyAppliesRepositoryContract } from '@src/modules/apply/application/contracts/repositories/list-my-applies.repository';
import ApplyEntity from '@src/modules/apply/domain/entities/apply.entity';
import {
  ApplySchema,
  ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import { ApplyDatabaseMapper } from '@src/modules/apply/infrastructure/database/mappers/apply-database.mapper';

@Injectable()
export class ListMyAppliesRepository implements ListMyAppliesRepositoryContract {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async findByUserId(userId: string): Promise<ApplyEntity[]> {
    const applies = await this.applyModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return applies.map((apply) => ApplyDatabaseMapper.toEntity(apply));
  }
}

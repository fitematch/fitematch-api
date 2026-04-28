import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import { ApplyDatabaseMapper } from '@src/modules/apply/infrastructure/database/mappers/apply-database.mapper';
import type { ListApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/list-apply.repository.interface';
import type { ListApplyInputDto } from '@src/modules/apply/application/dto/input/list-apply.input.dto';
import type { ListApplyRepositoryOutputDto } from '@src/modules/apply/application/dto/output/list-apply.repository-output.dto';
import ApplyEntity from '../../domain/entities/apply.entity';

type ListApplyLeanDocument = Omit<ListApplyRepositoryOutputDto, '_id'> & {
  _id: { toString(): string };
};

@Injectable()
export class ListApplyRepository implements ListApplyRepositoryInterface {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async list(
    input: ListApplyInputDto,
  ): Promise<ListApplyRepositoryOutputDto[]> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;

    const filters: Record<string, unknown> = {};

    if (input.jobId) {
      filters.jobId = input.jobId;
    }

    if (input.userId) {
      filters.userId = input.userId;
    }

    if (input.status) {
      filters.status = input.status;
    }

    const applies = await this.applyModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ListApplyLeanDocument[]>()
      .exec();

    return applies.map((apply) => ({
      _id: apply._id.toString(),
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    }));
  }

  async findByUserId(userId: string): Promise<ApplyEntity[]> {
    const applies = await this.applyModel.find({ userId }).exec();

    return applies.map((apply) => ApplyDatabaseMapper.toEntity(apply));
  }
}

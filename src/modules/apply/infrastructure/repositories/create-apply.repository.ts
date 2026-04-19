import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/create-apply.repository.interface';
import type { CreateApplyInputDto } from '@src/modules/apply/application/dto/input/create-apply.input.dto';
import type { CreateApplyOutputDto } from '@src/modules/apply/application/dto/output/create-apply.output.dto';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';

@Injectable()
export class CreateApplyRepository implements CreateApplyRepositoryInterface {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async existsByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<boolean> {
    const apply = await this.applyModel
      .findOne({ jobId, userId })
      .lean()
      .exec();

    return !!apply;
  }

  async create(input: CreateApplyInputDto): Promise<CreateApplyOutputDto> {
    try {
      const createdApply = await this.applyModel.create({
        jobId: input.jobId,
        userId: input.userId,
        status: input.status,
      });

      const timestamps = createdApply as unknown as {
        createdAt?: Date;
        updatedAt?: Date;
      };

      return {
        id: createdApply._id.toString(),
        jobId: createdApply.jobId,
        userId: createdApply.userId,
        status: createdApply.status,
        createdAt: timestamps.createdAt,
        updatedAt: timestamps.updatedAt,
      };
    } catch (error: unknown) {
      const mongoError = error as { code?: number };

      if (mongoError.code === 11000) {
        throw new ConflictException('User already applied to this job.');
      }

      throw error;
    }
  }
}

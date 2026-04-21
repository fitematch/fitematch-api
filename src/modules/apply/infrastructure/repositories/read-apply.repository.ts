import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import type { ReadApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/read-apply.repository.interface';
import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';

@Injectable()
export class ReadApplyRepository implements ReadApplyRepositoryInterface {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async read(input: ReadApplyInputDto): Promise<ReadApplyOutputDto | null> {
    const apply = (await this.applyModel.findById(input._id).lean().exec()) as
      | (ReadApplyOutputDto & { _id: { toString(): string } })
      | null;

    if (!apply) {
      return null;
    }

    return {
      _id: apply._id.toString(),
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    };
  }
}

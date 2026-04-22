import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import type { UpdateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/update-apply.repository.interface';
import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';

@Injectable()
export class UpdateApplyRepository implements UpdateApplyRepositoryInterface {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async update(
    input: UpdateApplyInputDto,
  ): Promise<UpdateApplyOutputDto | null> {
    const updatedApply = (await this.applyModel
      .findByIdAndUpdate(
        input._id,
        {
          ...(input.status !== undefined && { status: input.status }),
        },
        {
          returnDocument: 'after',
        },
      )
      .lean()
      .exec()) as
      | (UpdateApplyOutputDto & { _id: { toString(): string } })
      | null;

    if (!updatedApply) {
      return null;
    }

    return {
      _id: updatedApply._id.toString(),
      jobId: updatedApply.jobId,
      userId: updatedApply.userId,
      status: updatedApply.status,
      createdAt: updatedApply.createdAt,
      updatedAt: updatedApply.updatedAt,
    };
  }
}

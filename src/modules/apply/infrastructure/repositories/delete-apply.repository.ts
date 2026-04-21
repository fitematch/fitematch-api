import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import type { DeleteApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/delete-apply.repository.interface';
import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';

@Injectable()
export class DeleteApplyRepository implements DeleteApplyRepositoryInterface {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async delete(input: DeleteApplyInputDto): Promise<boolean> {
    const deletedApply = await this.applyModel
      .findByIdAndDelete(input._id)
      .lean()
      .exec();

    return !!deletedApply;
  }
}

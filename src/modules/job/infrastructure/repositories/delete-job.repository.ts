import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { DeleteJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-job.repository.interface';
import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';

@Injectable()
export class DeleteJobRepository implements DeleteJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async delete(input: DeleteJobInputDto): Promise<boolean> {
    const deletedJob = await this.jobModel
      .findByIdAndDelete(input.id)
      .lean()
      .exec();

    return !!deletedJob;
  }
}

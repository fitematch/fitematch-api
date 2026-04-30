import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/list-job.repository.interface';
import { ListJobInputDto } from '@src/modules/job/application/dto/input/list-job.input.dto';
import { ListJobRepositoryOutputDto } from '@src/modules/job/application/dto/output/list-job.repository-output.dto';
import {
  JobDocument,
  JobSchema,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';

type LeanJob = Omit<ListJobRepositoryOutputDto, '_id'> & {
  _id: { toString(): string };
};

export class ListJobRepository implements ListJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async list(input: ListJobInputDto): Promise<ListJobRepositoryOutputDto[]> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;

    const filters: Record<string, unknown> = {};

    if (input.status) {
      filters.status = input.status;
    }

    if (input.companyId) {
      filters.companyId = input.companyId;
    }

    if (input.search) {
      filters.$or = [
        { title: { $regex: input.search, $options: 'i' } },
        { description: { $regex: input.search, $options: 'i' } },
      ];
    }

    const jobs = (await this.jobModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec()) as LeanJob[];

    return jobs.map((job) => ({
      _id: job._id.toString(),
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits,
      media: job.media,
      contractType: job.contractType,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));
  }
}

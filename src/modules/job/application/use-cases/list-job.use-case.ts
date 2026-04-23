import { Inject, Injectable } from '@nestjs/common';
import type { ListJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/list-job.use-case.interface';
import type { ListJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/list-job.repository.interface';
import { LIST_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ListJobInputDto } from '@src/modules/job/application/dto/input/list-job.input.dto';
import { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';

@Injectable()
export class ListJobUseCase implements ListJobUseCaseInterface {
  constructor(
    @Inject(LIST_JOB_REPOSITORY)
    private readonly listJobRepository: ListJobRepositoryInterface,
  ) {}

  async execute(input: ListJobInputDto): Promise<ListJobOutputDto[]> {
    const jobs = await this.listJobRepository.list(input);

    return jobs.map((job) => ({
      _id: job._id,
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits,
      media: job.media,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { LIST_MY_JOBS_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ListMyJobsRepository } from '@src/modules/job/application/contracts/repositories/list-my-jobs.repository';
import type { ListMyJobsInput } from '@src/modules/job/application/dto/input/list-my-jobs.input';
import type { ListMyJobsOutput } from '@src/modules/job/application/dto/output/list-my-jobs.output';
import type { ListMyJobsUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/list-my-jobs.use-case.interface';

@Injectable()
export class ListMyJobsUseCase implements ListMyJobsUseCaseInterface {
  constructor(
    @Inject(LIST_MY_JOBS_REPOSITORY)
    private readonly listMyJobsRepository: ListMyJobsRepository,
  ) {}

  async execute(input: ListMyJobsInput): Promise<ListMyJobsOutput[]> {
    if (!input.companyId) {
      throw new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      );
    }

    const jobs = await this.listMyJobsRepository.findByCompanyId(
      input.companyId,
    );

    return jobs.map((job) => ({
      id: job._id,
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

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { ListAppliesByJobRepository } from '@src/modules/apply/application/contracts/repositories/list-applies-by-job.repository';
import { LIST_APPLIES_BY_JOB_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { ListAppliesByJobInput } from '@src/modules/apply/application/dto/input/list-applies-by-job.input';
import { ListAppliesByJobOutput } from '@src/modules/apply/application/dto/output/list-applies-by-job.output';

@Injectable()
export class ListAppliesByJobUseCase {
  constructor(
    @Inject(LIST_APPLIES_BY_JOB_REPOSITORY)
    private readonly listAppliesByJobRepository: ListAppliesByJobRepository,
  ) {}

  async execute(
    input: ListAppliesByJobInput,
  ): Promise<ListAppliesByJobOutput[]> {
    if (!input.jobId) {
      throw new BadRequestException('Job id is required.');
    }

    const applies = await this.listAppliesByJobRepository.findByJobId(
      input.jobId,
    );

    return applies.map((apply) => ({
      id: apply._id,
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    }));
  }
}

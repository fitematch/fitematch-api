import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LIST_APPLIES_BY_JOB_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListAppliesByJobRepository } from '@src/modules/apply/application/contracts/repositories/list-applies-by-job.repository';
import type { ListAppliesByJobInput } from '@src/modules/apply/application/dto/input/list-applies-by-job.input';
import type { ListAppliesByJobOutput } from '@src/modules/apply/application/dto/output/list-applies-by-job.output';
import type { ListAppliesByJobUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-applies-by-job.use-case.interface';
import { READ_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { READ_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';

@Injectable()
export class ListAppliesByJobUseCase implements ListAppliesByJobUseCaseInterface {
  constructor(
    @Inject(LIST_APPLIES_BY_JOB_REPOSITORY)
    private readonly repository: ListAppliesByJobRepository,

    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,

    @Inject(READ_USER_REPOSITORY)
    private readonly readUserRepository: ReadUserRepositoryInterface,
  ) {}

  async execute(
    input: ListAppliesByJobInput,
  ): Promise<ListAppliesByJobOutput[]> {
    const job = await this.readJobRepository.read({
      _id: input.jobId,
    });

    if (!job) {
      throw new NotFoundException('Job not found!');
    }

    if (
      !input.recruiterCompanyId ||
      job.companyId !== input.recruiterCompanyId
    ) {
      throw new ForbiddenException(
        'You are not allowed to list applies for this job!',
      );
    }

    const applies = await this.repository.findByJobId(input.jobId);

    return Promise.all(
      applies.map(async (apply) => {
        const user = await this.readUserRepository.read({
          _id: apply.userId,
        });

        return {
          id: apply._id,
          jobId: apply.jobId,
          userId: apply.userId,
          user: user
            ? {
                name: user.name,
                birthday: user.birthday,
                resumeUrl: user.candidateProfile?.media?.resumeUrl,
              }
            : undefined,
          status: apply.status,
          createdAt: apply.createdAt,
          updatedAt: apply.updatedAt,
        };
      }),
    );
  }
}

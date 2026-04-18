import type { Provider } from '@nestjs/common';
import {
  LIST_JOB_REPOSITORY,
  LIST_JOB_USE_CASE,
} from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ListJobUseCase } from '@src/modules/job/application/use-cases/list-job.use-case';
import { ListJobRepository } from '@src/modules/job/infrastructure/repositories/list-job.repository';

export const jobProviders: Provider[] = [
  {
    provide: LIST_JOB_USE_CASE,
    useClass: ListJobUseCase,
  },
  {
    provide: LIST_JOB_REPOSITORY,
    useClass: ListJobRepository,
  },
];

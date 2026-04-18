import type { Provider } from '@nestjs/common';
import {
  LIST_JOB_REPOSITORY,
  LIST_JOB_USE_CASE,
  CREATE_JOB_REPOSITORY,
  CREATE_JOB_USE_CASE,
  READ_JOB_REPOSITORY,
  READ_JOB_USE_CASE,
} from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ListJobUseCase } from '@src/modules/job/application/use-cases/list-job.use-case';
import { ListJobRepository } from '@src/modules/job/infrastructure/repositories/list-job.repository';
import { CreateJobUseCase } from '@src/modules/job/application/use-cases/create-job.use-case';
import { CreateJobRepository } from '@src/modules/job/infrastructure/repositories/create-job.repository';
import { ReadJobUseCase } from '@src/modules/job/application/use-cases/read-job.use-case';
import { ReadJobRepository } from '@src/modules/job/infrastructure/repositories/read-job.repository';

export const jobProviders: Provider[] = [
  {
    provide: LIST_JOB_USE_CASE,
    useClass: ListJobUseCase,
  },
  {
    provide: LIST_JOB_REPOSITORY,
    useClass: ListJobRepository,
  },
  {
    provide: CREATE_JOB_USE_CASE,
    useClass: CreateJobUseCase,
  },
  {
    provide: CREATE_JOB_REPOSITORY,
    useClass: CreateJobRepository,
  },
  {
    provide: READ_JOB_USE_CASE,
    useClass: ReadJobUseCase,
  },
  {
    provide: READ_JOB_REPOSITORY,
    useClass: ReadJobRepository,
  },
];

import type { Provider } from '@nestjs/common';
import {
  LIST_JOB_REPOSITORY,
  LIST_JOB_USE_CASE,
  CREATE_JOB_REPOSITORY,
  CREATE_JOB_USE_CASE,
  READ_JOB_REPOSITORY,
  READ_JOB_USE_CASE,
  UPDATE_JOB_REPOSITORY,
  UPDATE_JOB_USE_CASE,
  DELETE_JOB_REPOSITORY,
  DELETE_JOB_USE_CASE,
  LIST_MY_JOBS_REPOSITORY,
  LIST_MY_JOBS_USE_CASE,
  LIST_JOB_COMPANIES_REPOSITORY,
} from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ListJobUseCase } from '@src/modules/job/application/use-cases/list-job.use-case';
import { ListJobRepository } from '@src/modules/job/infrastructure/repositories/list-job.repository';
import { CreateJobUseCase } from '@src/modules/job/application/use-cases/create-job.use-case';
import { CreateJobRepository } from '@src/modules/job/infrastructure/repositories/create-job.repository';
import { ReadJobUseCase } from '@src/modules/job/application/use-cases/read-job.use-case';
import { ReadJobRepository } from '@src/modules/job/infrastructure/repositories/read-job.repository';
import { UpdateJobUseCase } from '@src/modules/job/application/use-cases/update-job.use-case';
import { UpdateJobRepository } from '@src/modules/job/infrastructure/repositories/update-job.repository';
import { DeleteJobUseCase } from '@src/modules/job/application/use-cases/delete-job.use-case';
import { DeleteJobRepository } from '@src/modules/job/infrastructure/repositories/delete-job.repository';
import { ListMyJobsUseCase } from '@src/modules/job/application/use-cases/list-my-jobs.use-case';
import { ListMyJobsRepository } from '@src/modules/job/infrastructure/repositories/list-my-jobs.repository';
import { ListJobCompaniesRepository } from '@src/modules/job/infrastructure/repositories/list-job-companies.repository';

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
  {
    provide: UPDATE_JOB_USE_CASE,
    useClass: UpdateJobUseCase,
  },
  {
    provide: UPDATE_JOB_REPOSITORY,
    useClass: UpdateJobRepository,
  },
  {
    provide: DELETE_JOB_USE_CASE,
    useClass: DeleteJobUseCase,
  },
  {
    provide: DELETE_JOB_REPOSITORY,
    useClass: DeleteJobRepository,
  },
  {
    provide: LIST_MY_JOBS_USE_CASE,
    useClass: ListMyJobsUseCase,
  },
  {
    provide: LIST_MY_JOBS_REPOSITORY,
    useClass: ListMyJobsRepository,
  },
  {
    provide: LIST_JOB_COMPANIES_REPOSITORY,
    useClass: ListJobCompaniesRepository,
  },
];

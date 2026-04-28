import { JobEntity } from '@src/modules/job/domain/entities/job.entity';

export interface ListMyJobsRepository {
  findByCompanyId(companyId: string): Promise<JobEntity[]>;
}

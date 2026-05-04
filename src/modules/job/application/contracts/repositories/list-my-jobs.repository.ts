import { JobEntity } from '@src/modules/job/domain/entities/job.entity';

export interface ListMyJobsRepository {
  findRecruiterCompanyId(userId: string): Promise<string | null>;
  findByCompanyId(companyId: string): Promise<JobEntity[]>;
}

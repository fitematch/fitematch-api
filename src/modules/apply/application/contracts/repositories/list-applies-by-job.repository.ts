import ApplyEntity from '@src/modules/apply/domain/entities/apply.entity';

export interface ListAppliesByJobRepository {
  findByJobId(jobId: string): Promise<ApplyEntity[]>;
}

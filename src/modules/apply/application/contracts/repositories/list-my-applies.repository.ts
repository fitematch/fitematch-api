import ApplyEntity from '@src/modules/apply/domain/entities/apply.entity';

export interface ListMyAppliesRepository {
  findByUserId(userId: string): Promise<ApplyEntity[]>;
}

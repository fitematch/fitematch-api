import { ListMyAppliesRepositoryOutputDto } from '@src/modules/apply/application/dto/output/list-my-applies.repository-output.dto';

export interface ListMyAppliesRepository {
  findByUserId(userId: string): Promise<ListMyAppliesRepositoryOutputDto[]>;
}

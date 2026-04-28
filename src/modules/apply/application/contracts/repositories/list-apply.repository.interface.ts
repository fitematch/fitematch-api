import type { ListApplyInputDto } from '@src/modules/apply/application/dto/input/list-apply.input.dto';
import type { ListApplyRepositoryOutputDto } from '@src/modules/apply/application/dto/output/list-apply.repository-output.dto';
import ApplyEntity from '@src/modules/apply/domain/entities/apply.entity';

export interface ListApplyRepositoryInterface {
  list(input: ListApplyInputDto): Promise<ListApplyRepositoryOutputDto[]>;
  findByUserId(userId: string): Promise<ApplyEntity[]>;
}

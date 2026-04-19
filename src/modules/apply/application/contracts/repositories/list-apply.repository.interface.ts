import type { ListApplyInputDto } from '@src/modules/apply/application/dto/input/list-apply.input.dto';
import type { ListApplyRepositoryOutputDto } from '@src/modules/apply/application/dto/output/list-apply.repository-output.dto';

export interface ListApplyRepositoryInterface {
  list(input: ListApplyInputDto): Promise<ListApplyRepositoryOutputDto[]>;
}

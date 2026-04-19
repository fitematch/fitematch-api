import type { ListApplyInputDto } from '@src/modules/apply/application/dto/input/list-apply.input.dto';
import type { ListApplyOutputDto } from '@src/modules/apply/application/dto/output/list-apply.output.dto';

export interface ListApplyUseCaseInterface {
  execute(input: ListApplyInputDto): Promise<ListApplyOutputDto[]>;
}

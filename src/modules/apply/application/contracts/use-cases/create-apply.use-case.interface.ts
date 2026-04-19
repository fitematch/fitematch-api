import type { CreateApplyInputDto } from '@src/modules/apply/application/dto/input/create-apply.input.dto';
import type { CreateApplyOutputDto } from '@src/modules/apply/application/dto/output/create-apply.output.dto';

export interface CreateApplyUseCaseInterface {
  execute(input: CreateApplyInputDto): Promise<CreateApplyOutputDto>;
}

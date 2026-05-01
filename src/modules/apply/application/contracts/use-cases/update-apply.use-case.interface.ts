import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';

export interface UpdateApplyUseCaseInterface {
  execute(input: UpdateApplyInputDto): Promise<UpdateApplyOutputDto>;
}

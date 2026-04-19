import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';

export interface DeleteApplyUseCaseInterface {
  execute(input: DeleteApplyInputDto): Promise<boolean>;
}

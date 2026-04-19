import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';

export interface DeleteApplyRepositoryInterface {
  delete(input: DeleteApplyInputDto): Promise<boolean>;
}

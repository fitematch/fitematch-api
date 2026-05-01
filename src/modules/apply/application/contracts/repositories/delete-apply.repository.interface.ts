import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';

export interface DeleteApplyRepositoryInterface {
  readById(_id: string): Promise<ReadApplyOutputDto | null>;
  delete(input: DeleteApplyInputDto): Promise<boolean>;
}

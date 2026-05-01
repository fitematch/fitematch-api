import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';
import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';

export interface UpdateApplyRepositoryInterface {
  readById(_id: string): Promise<ReadApplyOutputDto | null>;
  update(input: UpdateApplyInputDto): Promise<UpdateApplyOutputDto | null>;
}

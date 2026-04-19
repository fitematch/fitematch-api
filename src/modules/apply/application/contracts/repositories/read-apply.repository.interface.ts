import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';

export interface ReadApplyRepositoryInterface {
  read(input: ReadApplyInputDto): Promise<ReadApplyOutputDto | null>;
}

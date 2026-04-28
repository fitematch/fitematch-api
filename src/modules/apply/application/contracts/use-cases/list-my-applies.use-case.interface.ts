import { ListMyAppliesInput } from '@src/modules/apply/application/dto/input/list-my-applies.input';
import { ListMyAppliesOutput } from '@src/modules/apply/application/dto/output/list-my-applies.output';

export interface ListMyAppliesUseCaseInterface {
  execute(input: ListMyAppliesInput): Promise<ListMyAppliesOutput[]>;
}

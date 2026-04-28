import { ListAppliesByJobInput } from '@src/modules/apply/application/dto/input/list-applies-by-job.input';
import { ListAppliesByJobOutput } from '@src/modules/apply/application/dto/output/list-applies-by-job.output';

export interface ListAppliesByJobUseCaseInterface {
  execute(input: ListAppliesByJobInput): Promise<ListAppliesByJobOutput[]>;
}

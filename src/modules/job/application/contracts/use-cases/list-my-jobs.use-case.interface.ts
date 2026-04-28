import { ListMyJobsInput } from '@src/modules/job/application/dto/input/list-my-jobs.input';
import { ListMyJobsOutput } from '@src/modules/job/application/dto/output/list-my-jobs.output';

export interface ListMyJobsUseCaseInterface {
  execute(input: ListMyJobsInput): Promise<ListMyJobsOutput[]>;
}

import { ListJobInputDto } from '@src/modules/job/application/dto/input/list-job.input.dto';
import { ListJobRepositoryOutputDto } from '@src/modules/job/application/dto/output/list-job.repository-output.dto';

export interface ListJobRepositoryInterface {
  list(input: ListJobInputDto): Promise<ListJobRepositoryOutputDto[]>;
}

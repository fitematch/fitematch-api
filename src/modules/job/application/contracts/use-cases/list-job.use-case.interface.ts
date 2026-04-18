import { ListJobInputDto } from '@src/modules/job/application/dto/input/list-job.input.dto';
import { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';

export interface ListJobUseCaseInterface {
  execute(input: ListJobInputDto): Promise<ListJobOutputDto[]>;
}

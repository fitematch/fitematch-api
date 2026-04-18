import { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';

export interface CreateJobUseCaseInterface {
  execute(input: CreateJobInputDto): Promise<CreateJobOutputDto>;
}

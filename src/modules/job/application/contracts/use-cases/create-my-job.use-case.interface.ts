import { CreateMyJobInputDto } from '@src/modules/job/application/dto/input/create-my-job.input.dto';
import { CreateMyJobOutputDto } from '@src/modules/job/application/dto/output/create-my-job.output.dto';

export interface CreateMyJobUseCaseInterface {
  execute(input: CreateMyJobInputDto): Promise<CreateMyJobOutputDto>;
}

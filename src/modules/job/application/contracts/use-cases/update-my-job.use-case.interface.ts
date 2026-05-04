import { UpdateMyJobInputDto } from '@src/modules/job/application/dto/input/update-my-job.input.dto';
import { UpdateMyJobOutputDto } from '@src/modules/job/application/dto/output/update-my-job.output.dto';

export interface UpdateMyJobUseCaseInterface {
  execute(input: UpdateMyJobInputDto): Promise<UpdateMyJobOutputDto>;
}

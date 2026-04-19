import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';

export interface UpdateJobUseCaseInterface {
  execute(input: UpdateJobInputDto): Promise<UpdateJobOutputDto | null>;
}

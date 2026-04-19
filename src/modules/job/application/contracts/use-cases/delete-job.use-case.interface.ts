import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';

export interface DeleteJobUseCaseInterface {
  execute(input: DeleteJobInputDto): Promise<boolean>;
}

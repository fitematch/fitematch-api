import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';

export interface DeleteJobRepositoryInterface {
  delete(input: DeleteJobInputDto): Promise<boolean>;
}

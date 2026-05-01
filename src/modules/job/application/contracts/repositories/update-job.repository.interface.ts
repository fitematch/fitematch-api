import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';

export interface UpdateJobRepositoryInterface {
  readById(_id: string): Promise<ReadJobOutputDto | null>;
  update(input: UpdateJobInputDto): Promise<UpdateJobOutputDto | null>;
}

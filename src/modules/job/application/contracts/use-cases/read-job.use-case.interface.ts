import type { ReadJobInputDto } from '@src/modules/job/application/dto/input/read-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';

export interface ReadJobUseCaseInterface {
  execute(input: ReadJobInputDto): Promise<ReadJobOutputDto | null>;
}

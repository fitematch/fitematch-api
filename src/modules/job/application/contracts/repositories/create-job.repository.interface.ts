import { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';

export interface CreateJobRepositoryInterface {
  existsBySlug(slug: string): Promise<boolean>;
  create(input: CreateJobInputDto): Promise<CreateJobOutputDto>;
}

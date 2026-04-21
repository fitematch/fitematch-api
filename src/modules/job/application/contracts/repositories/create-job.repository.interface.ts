import { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export interface CreateJobRepositoryInterface {
  existsBySlug(slug: string): Promise<boolean>;
  existsDuplicate(
    companyId: string,
    title: string,
    statuses: JobStatusEnum[],
  ): Promise<boolean>;
  create(input: CreateJobInputDto): Promise<CreateJobOutputDto>;
}

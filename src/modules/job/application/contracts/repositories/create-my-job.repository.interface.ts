import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { CreateMyJobInputDto } from '@src/modules/job/application/dto/input/create-my-job.input.dto';
import { CreateMyJobOutputDto } from '@src/modules/job/application/dto/output/create-my-job.output.dto';

export interface CreateMyJobRepositoryInterface {
  findRecruiterCompanyId(
    userId: string,
    companyId?: string,
  ): Promise<string | null>;
  findCompanySlugContext(companyId: string): Promise<{
    tradeName?: string;
    city?: string;
    state?: string;
  } | null>;
  existsBySlug(slug: string): Promise<boolean>;
  existsDuplicate(
    companyId: string,
    title: string,
    statuses: JobStatusEnum[],
  ): Promise<boolean>;
  create(
    input: CreateMyJobInputDto & { companyId: string },
  ): Promise<CreateMyJobOutputDto>;
}

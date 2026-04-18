import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export class ListJobInputDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatusEnum;
  companyId?: string;
}

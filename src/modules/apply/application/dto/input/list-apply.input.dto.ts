import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class ListApplyInputDto {
  page?: number;
  limit?: number;
  jobId?: string;
  userId?: string;
  status?: ApplicationStatusEnum;
}

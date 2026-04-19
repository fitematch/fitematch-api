import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class CreateApplyInputDto {
  jobId!: string;
  userId!: string;
  status?: ApplicationStatusEnum;
}

import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class ListApplyRepositoryOutputDto {
  id!: string;
  jobId!: string;
  userId!: string;
  status!: ApplicationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

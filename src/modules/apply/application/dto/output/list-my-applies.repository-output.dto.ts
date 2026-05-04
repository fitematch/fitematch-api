import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class ListMyAppliesRepositoryOutputDto {
  _id!: string;
  jobId!: string;
  userId!: string;
  status!: ApplicationStatusEnum;
  details!: {
    jobTitle: string;
    tradeName: string;
    logoUrl: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

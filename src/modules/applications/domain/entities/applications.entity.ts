import { ApplicationStatusEnum } from '@src/modules/applications/domain/enums/application-status.enum';

export default interface ApplicationEntity {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

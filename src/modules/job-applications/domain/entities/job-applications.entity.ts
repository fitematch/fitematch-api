import { ApplicationStatusEnum } from '@src/modules/job-applications/domain/enums/application-status.enum';

export default interface JobApplicationEntity {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

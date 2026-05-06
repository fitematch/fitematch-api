import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export interface UserAppliesByJobOutput {
  name: string;
  birthday?: string;
  resumeUrl?: string;
}

export interface ListAppliesByJobOutput {
  id: string;
  jobId: string;
  userId: string;
  user?: UserAppliesByJobOutput;
  status: ApplicationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

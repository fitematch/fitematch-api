import { JobMediaEntity } from '@src/modules/job/domain/entities/job-media.entity';
import {
  BenefitsEntity,
  RequirementsEntity,
} from '@src/modules/job/domain/entities/job.entity';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export interface ListMyJobsOutput {
  id: string;
  slug: string;
  companyId: string;
  title: string;
  description: string;
  slots: number;
  requirements?: RequirementsEntity;
  benefits?: BenefitsEntity;
  media?: JobMediaEntity;
  status: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

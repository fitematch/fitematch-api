import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export class UpdateJobResponseDto {
  id!: string;
  slug!: string;
  companyId!: string;
  title!: string;
  description!: string;
  slots!: number;
  requirements?: unknown;
  benefits?: unknown;
  status!: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

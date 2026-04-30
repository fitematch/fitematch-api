import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';

export class UpdateJobResponseDto {
  _id!: string;
  slug!: string;
  companyId!: string;
  title!: string;
  description!: string;
  slots!: number;
  requirements?: unknown;
  benefits?: unknown;
  media?: unknown;
  contractType!: JobContractTypeEnum;
  status!: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

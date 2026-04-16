import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export interface RequirementsEntity {
  educationLevel?: string;
  experienceYears?: number;
  skills?: string[];
}

export interface BenefitsEntity {
  salary?: number;
  healthInsurance?: boolean;
  dentalInsurance?: boolean;
  alimentationVoucher?: boolean;
  transportationVoucher?: boolean;
}

export interface JobEntity {
  id: string;
  companyId: string;
  title: string;
  description: string;
  slots: number;
  requirements?: RequirementsEntity;
  benefits?: BenefitsEntity;
  status: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

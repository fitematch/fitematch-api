import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export interface LanguageRequirement {
  name: LanguagesEnum;
  level: LanguagesLevelEnum;
}
export interface RequirementsEntity {
  educationLevel?: EducationLevelEnum[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  languages?: LanguageRequirement[];
  hardSkills?: {
    required?: HardSkillsEnum[];
    niceToHave?: HardSkillsEnum[];
  };
  softSkills?: {
    required?: SoftSkillsEnum[];
    niceToHave?: SoftSkillsEnum[];
  };
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

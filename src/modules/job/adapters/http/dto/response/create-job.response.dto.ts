import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';

export class CreateJobResponseDto {
  _id!: string;
  slug!: string;
  companyId!: string;
  title!: string;
  description!: string;
  slots!: number;
  requirements?: {
    educationLevel?: EducationLevelEnum[];
    minExperienceYears?: number;
    maxExperienceYears?: number;
    languages?: {
      name: LanguagesEnum;
      level: LanguagesLevelEnum;
    }[];
    hardSkills?: {
      required?: HardSkillsEnum[];
      niceToHave?: HardSkillsEnum[];
    };
    softSkills?: {
      required?: SoftSkillsEnum[];
      niceToHave?: SoftSkillsEnum[];
    };
  };
  benefits?: {
    salary?: string;
    healthInsurance?: boolean;
    dentalInsurance?: boolean;
    alimentationVoucher?: boolean;
    transportationVoucher?: boolean;
  };
  status!: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

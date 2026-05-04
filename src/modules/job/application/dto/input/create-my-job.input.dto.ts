import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import type { JobMediaEntity } from '@src/modules/job/domain/entities/job-media.entity';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';

export class CreateMyJobInputDto {
  userId!: string;
  companyId?: string;
  slug?: string;
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
    salary?: number;
    healthInsurance?: boolean;
    dentalInsurance?: boolean;
    alimentationVoucher?: boolean;
    transportationVoucher?: boolean;
  };
  media?: JobMediaEntity;
  contractType!: JobContractTypeEnum;
  status?: JobStatusEnum;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';

class LanguageRequirementRequestDto {
  @ApiProperty({ enum: LanguagesEnum })
  name!: LanguagesEnum;

  @ApiProperty({ enum: LanguagesLevelEnum })
  level!: LanguagesLevelEnum;
}

class SkillGroupRequestDto {
  @ApiPropertyOptional({ enum: HardSkillsEnum, isArray: true })
  required?: HardSkillsEnum[];

  @ApiPropertyOptional({ enum: HardSkillsEnum, isArray: true })
  niceToHave?: HardSkillsEnum[];
}

class SoftSkillGroupRequestDto {
  @ApiPropertyOptional({ enum: SoftSkillsEnum, isArray: true })
  required?: SoftSkillsEnum[];

  @ApiPropertyOptional({ enum: SoftSkillsEnum, isArray: true })
  niceToHave?: SoftSkillsEnum[];
}

class RequirementsRequestDto {
  @ApiPropertyOptional({ enum: EducationLevelEnum, isArray: true })
  educationLevel?: EducationLevelEnum[];

  @ApiPropertyOptional()
  minExperienceYears?: number;

  @ApiPropertyOptional()
  maxExperienceYears?: number;

  @ApiPropertyOptional({ type: [LanguageRequirementRequestDto] })
  languages?: LanguageRequirementRequestDto[];

  @ApiPropertyOptional({ type: SkillGroupRequestDto })
  hardSkills?: SkillGroupRequestDto;

  @ApiPropertyOptional({ type: SoftSkillGroupRequestDto })
  softSkills?: SoftSkillGroupRequestDto;
}

class BenefitsRequestDto {
  @ApiPropertyOptional()
  salary?: number;

  @ApiPropertyOptional()
  healthInsurance?: boolean;

  @ApiPropertyOptional()
  dentalInsurance?: boolean;

  @ApiPropertyOptional()
  alimentationVoucher?: boolean;

  @ApiPropertyOptional()
  transportationVoucher?: boolean;
}

export class CreateJobRequestDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  slots!: number;

  @ApiPropertyOptional({ type: RequirementsRequestDto })
  requirements?: RequirementsRequestDto;

  @ApiPropertyOptional({ type: BenefitsRequestDto })
  benefits?: BenefitsRequestDto;

  @ApiPropertyOptional({ enum: JobStatusEnum })
  status?: JobStatusEnum;
}

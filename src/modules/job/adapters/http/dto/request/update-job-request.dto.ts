import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';

class LanguageRequirementRequestDto {
  @ApiPropertyOptional({ enum: LanguagesEnum })
  @IsEnum(LanguagesEnum)
  name!: LanguagesEnum;

  @ApiPropertyOptional({ enum: LanguagesLevelEnum })
  @IsEnum(LanguagesLevelEnum)
  level!: LanguagesLevelEnum;
}

class HardSkillGroupRequestDto {
  @ApiPropertyOptional({ enum: HardSkillsEnum, isArray: true })
  @IsOptional()
  @IsEnum(HardSkillsEnum, { each: true })
  required?: HardSkillsEnum[];

  @ApiPropertyOptional({ enum: HardSkillsEnum, isArray: true })
  @IsOptional()
  @IsEnum(HardSkillsEnum, { each: true })
  niceToHave?: HardSkillsEnum[];
}

class SoftSkillGroupRequestDto {
  @ApiPropertyOptional({ enum: SoftSkillsEnum, isArray: true })
  @IsOptional()
  @IsEnum(SoftSkillsEnum, { each: true })
  required?: SoftSkillsEnum[];

  @ApiPropertyOptional({ enum: SoftSkillsEnum, isArray: true })
  @IsOptional()
  @IsEnum(SoftSkillsEnum, { each: true })
  niceToHave?: SoftSkillsEnum[];
}

class UpdateJobRequirementsRequestDto {
  @ApiPropertyOptional({ enum: EducationLevelEnum, isArray: true })
  @IsOptional()
  @IsEnum(EducationLevelEnum, { each: true })
  educationLevel?: EducationLevelEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minExperienceYears?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxExperienceYears?: number;

  @ApiPropertyOptional({
    type: [LanguageRequirementRequestDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LanguageRequirementRequestDto)
  languages?: LanguageRequirementRequestDto[];

  @ApiPropertyOptional({
    type: HardSkillGroupRequestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => HardSkillGroupRequestDto)
  hardSkills?: HardSkillGroupRequestDto;

  @ApiPropertyOptional({
    type: SoftSkillGroupRequestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SoftSkillGroupRequestDto)
  softSkills?: SoftSkillGroupRequestDto;
}

class UpdateJobBenefitsRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  healthInsurance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  dentalInsurance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  alimentationVoucher?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  transportationVoucher?: boolean;
}

class UpdateJobMediaRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class UpdateJobRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  slots?: number;

  @ApiPropertyOptional({
    enum: JobContractTypeEnum,
  })
  @IsOptional()
  @IsEnum(JobContractTypeEnum)
  contractType?: JobContractTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobRequirementsRequestDto)
  requirements?: UpdateJobRequirementsRequestDto;

  @ApiPropertyOptional({
    type: UpdateJobBenefitsRequestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobBenefitsRequestDto)
  benefits?: UpdateJobBenefitsRequestDto;

  @ApiPropertyOptional({
    type: UpdateJobMediaRequestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobMediaRequestDto)
  media?: UpdateJobMediaRequestDto;

  @ApiPropertyOptional({
    enum: JobStatusEnum,
  })
  @IsOptional()
  @IsEnum(JobStatusEnum)
  status?: JobStatusEnum;
}

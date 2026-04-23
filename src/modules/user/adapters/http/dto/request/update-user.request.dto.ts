import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { EthnicityTypeEnum } from '@src/shared/domain/enums/ethnicity-role.enum';
import { GenderIdentityEnum } from '@src/shared/domain/enums/gender-identity.enum';
import { SexualOrientationEnum } from '@src/shared/domain/enums/sexual-orientation.enum';
import { ClothingSizeEnum } from '@src/shared/domain/enums/clothing-size.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { ShoesSizeUnitEnum } from '@src/shared/domain/enums/shoes-size-unit.enum';
import { CourseTypeEnum } from '@src/shared/domain/enums/course-type.enum';

export class CandidateDocumentRGRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class CandidateDocumentCPFRequestDto {
  @IsOptional()
  @IsString()
  number?: string;
}

export class CandidateDocumentCREFRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CandidateDocumentPassportRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

export class CandidateDocumentsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateDocumentRGRequestDto)
  rg?: CandidateDocumentRGRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateDocumentCPFRequestDto)
  cpf?: CandidateDocumentCPFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateDocumentCREFRequestDto)
  cref?: CandidateDocumentCREFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateDocumentPassportRequestDto)
  passport?: CandidateDocumentPassportRequestDto;
}

export class PhoneRequestDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsBoolean()
  isWhatsapp?: boolean;

  @IsOptional()
  @IsBoolean()
  isTelegram?: boolean;
}

export class AddressRequestDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class SocialRequestDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  x?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsString()
  tiktok?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
}

export class CandidateContactsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressRequestDto)
  address?: AddressRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialRequestDto)
  social?: SocialRequestDto;
}

export class RecruiterContactsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;
}

export class CandidateMediaRequestDto {
  @IsOptional()
  @IsString()
  resumeUrl?: string;
}

export class DiversityRequestDto {
  @IsOptional()
  @IsEnum(GenderIdentityEnum)
  genderIdentity?: GenderIdentityEnum;

  @IsOptional()
  @IsEnum(SexualOrientationEnum)
  sexualOrientation?: SexualOrientationEnum;
}

export class PhysicalAttributesRequestDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}

export class UniformRequestDto {
  @IsOptional()
  @IsEnum(ClothingSizeEnum)
  tShirtSize?: ClothingSizeEnum;

  @IsOptional()
  @IsEnum(ClothingSizeEnum)
  jacketSize?: ClothingSizeEnum;

  @IsOptional()
  @IsEnum(ClothingSizeEnum)
  shortSize?: ClothingSizeEnum;

  @IsOptional()
  @IsEnum(ClothingSizeEnum)
  pantsSize?: ClothingSizeEnum;

  @IsOptional()
  @IsNumber()
  shoeSize?: number;

  @IsOptional()
  @IsEnum(ShoesSizeUnitEnum)
  shoeSizeUnit?: ShoesSizeUnitEnum;
}

export class EducationRequestDto {
  @IsString()
  courseName!: string;

  @IsString()
  institution!: string;

  @IsNumber()
  startYear!: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsEnum(CourseTypeEnum)
  courseType!: CourseTypeEnum;

  @IsBoolean()
  isOngoing!: boolean;
}

export class ProfessionalExperienceRequestDto {
  @IsString()
  companyName!: string;

  @IsString()
  role!: string;

  @IsNumber()
  startYear!: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsBoolean()
  isCurrent!: boolean;
}

export class CandidateProfileRequestDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CandidateDocumentsRequestDto)
  documents?: CandidateDocumentsRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateContactsRequestDto)
  contacts?: CandidateContactsRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CandidateMediaRequestDto)
  media?: CandidateMediaRequestDto;

  @IsOptional()
  @IsEnum(EthnicityTypeEnum)
  ethnicity?: EthnicityTypeEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => DiversityRequestDto)
  diversity?: DiversityRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalAttributesRequestDto)
  physicalAttributes?: PhysicalAttributesRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniformRequestDto)
  uniform?: UniformRequestDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationRequestDto)
  educations?: EducationRequestDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionalExperienceRequestDto)
  professionalExperiences?: ProfessionalExperienceRequestDto[];

  @IsOptional()
  @IsArray()
  @IsEnum(AvailabilityShiftEnum, { each: true })
  availability?: AvailabilityShiftEnum[];
}

export class RecruiterProfileRequestDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecruiterContactsRequestDto)
  contacts?: RecruiterContactsRequestDto;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CandidateProfileRequestDto)
  candidateProfile?: CandidateProfileRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RecruiterProfileRequestDto)
  recruiterProfile?: RecruiterProfileRequestDto;

  @IsOptional()
  @IsEnum(ProductRoleEnum)
  productRole?: ProductRoleEnum;

  @IsOptional()
  @IsEnum(AdminRoleEnum)
  adminRole?: AdminRoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;
}

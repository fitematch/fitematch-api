import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { EthnicityTypeEnum } from '@src/shared/domain/enums/ethnicity-role.enum';
import { GenderIdentityEnum } from '@src/shared/domain/enums/gender-identity.enum';
import { SexualOrientationEnum } from '@src/shared/domain/enums/sexual-orientation.enum';
import { ClothingSizeEnum } from '@src/shared/domain/enums/clothing-size.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { ShoesSizeUnitEnum } from '@src/shared/domain/enums/shoes-size-unit.enum';
import { CourseTypeEnum } from '@src/shared/domain/enums/course-type.enum';
import { PhoneEntity } from '@src/shared/domain/enums/entities/phone.entity';
import { AddressEntity } from '@src/shared/domain/enums/entities/address.entity';
import { SocialEntity } from '@src/shared/domain/enums/entities/social.entity';

export interface CandidateContactsEntity {
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
}

export interface RecruiterContactsEntity {
  phone?: PhoneEntity;
}
export interface CandidateDocumentRGEntity {
  number: string;
  issuer: string;
  state: string;
}

export interface CandidateDocumentCPFEntity {
  number: string;
}

export interface CandidateDocumentCNPJEntity {
  number: string;
}

export interface CandidateDocumentCREFEntity {
  number: string;
  category: string;
  isActive: boolean;
}

export interface CandidateDocumentPassportEntity {
  number: string;
  country: string;
  expirationDate: Date;
}

export interface CandidateDocumentsEntity {
  rg?: CandidateDocumentRGEntity;
  cpf?: CandidateDocumentCPFEntity;
  cref?: CandidateDocumentCREFEntity;
  passport?: CandidateDocumentPassportEntity;
}

export interface CandidateMediaEntity {
  resumeUrl?: string;
}

export interface DiversityEntity {
  genderIdentity?: GenderIdentityEnum;
  sexualOrientation?: SexualOrientationEnum;
}

export interface PhysicalAttributesEntity {
  height?: number;
  weight?: number;
}

export interface UniformEntity {
  tShirtSize?: ClothingSizeEnum;
  jacketSize?: ClothingSizeEnum;
  shortSize?: ClothingSizeEnum;
  pantsSize?: ClothingSizeEnum;
  shoeSize?: number;
  shoeSizeUnit?: ShoesSizeUnitEnum;
}

export interface EducationEntity {
  courseName: string;
  institution: string;
  startYear: number;
  endYear?: number;
  courseType: CourseTypeEnum;
  isOngoing: boolean;
}

export interface ProfessionalExperienceEntity {
  companyName: string;
  role: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export interface CandidateProfileEntity {
  documents?: CandidateDocumentsEntity;
  contacts?: CandidateContactsEntity;
  media?: CandidateMediaEntity;
  ethnicity?: EthnicityTypeEnum;
  diversity?: DiversityEntity;
  physicalAttributes?: PhysicalAttributesEntity;
  uniform?: UniformEntity;
  educations?: EducationEntity[];
  professionalExperiences?: ProfessionalExperienceEntity[];
  availability?: AvailabilityShiftEnum[];
}

export interface RecruiterProfileEntity {
  companyId?: string;
  position?: string;
  contacts?: RecruiterContactsEntity;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
  productRole: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

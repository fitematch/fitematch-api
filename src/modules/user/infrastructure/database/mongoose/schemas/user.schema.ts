import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
class CandidateDocumentRGSchema {
  @Prop()
  number?: string;

  @Prop()
  issuer?: string;

  @Prop()
  state?: string;
}

@Schema({ _id: false })
class CandidateDocumentCPFSchema {
  @Prop()
  number?: string;
}

@Schema({ _id: false })
class CandidateDocumentCREFSchema {
  @Prop()
  number?: string;

  @Prop()
  category?: string;

  @Prop()
  isActive?: boolean;
}

@Schema({ _id: false })
class CandidateDocumentPassportSchema {
  @Prop()
  number?: string;

  @Prop()
  country?: string;

  @Prop()
  expirationDate?: Date;
}

@Schema({ _id: false })
class CandidateDocumentsSchema {
  @Prop({ type: CandidateDocumentRGSchema })
  rg?: CandidateDocumentRGSchema;

  @Prop({ type: CandidateDocumentCPFSchema })
  cpf?: CandidateDocumentCPFSchema;

  @Prop({ type: CandidateDocumentCREFSchema })
  cref?: CandidateDocumentCREFSchema;

  @Prop({ type: CandidateDocumentPassportSchema })
  passport?: CandidateDocumentPassportSchema;
}

@Schema({ _id: false })
class PhoneSchema {
  @Prop()
  country?: string;

  @Prop()
  number?: string;

  @Prop()
  isWhatsapp?: boolean;

  @Prop()
  isTelegram?: boolean;
}

@Schema({ _id: false })
class AddressSchema {
  @Prop()
  street?: string;

  @Prop()
  number?: string;

  @Prop()
  complement?: string;

  @Prop()
  neighborhood?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop()
  zipCode?: string;
}

@Schema({ _id: false })
class SocialSchema {
  @Prop()
  facebook?: string;

  @Prop()
  instagram?: string;

  @Prop()
  x?: string;

  @Prop()
  youtube?: string;

  @Prop()
  tiktok?: string;

  @Prop()
  linkedin?: string;
}

@Schema({ _id: false })
class CandidateContactsSchema {
  @Prop({ type: PhoneSchema })
  phone?: PhoneSchema;

  @Prop({ type: AddressSchema })
  address?: AddressSchema;

  @Prop({ type: SocialSchema })
  social?: SocialSchema;
}

@Schema({ _id: false })
class RecruiterContactsSchema {
  @Prop({ type: PhoneSchema })
  phone?: PhoneSchema;
}

@Schema({ _id: false })
class CandidateMediaSchema {
  @Prop()
  resumeUrl?: string;
}

@Schema({ _id: false })
class DiversitySchema {
  @Prop({ enum: Object.values(GenderIdentityEnum) })
  genderIdentity?: GenderIdentityEnum;

  @Prop({ enum: Object.values(SexualOrientationEnum) })
  sexualOrientation?: SexualOrientationEnum;
}

@Schema({ _id: false })
class PhysicalAttributesSchema {
  @Prop()
  height?: number;

  @Prop()
  weight?: number;
}

@Schema({ _id: false })
class UniformSchema {
  @Prop({ enum: Object.values(ClothingSizeEnum) })
  tShirtSize?: ClothingSizeEnum;

  @Prop({ enum: Object.values(ClothingSizeEnum) })
  jacketSize?: ClothingSizeEnum;

  @Prop({ enum: Object.values(ClothingSizeEnum) })
  shortSize?: ClothingSizeEnum;

  @Prop({ enum: Object.values(ClothingSizeEnum) })
  pantsSize?: ClothingSizeEnum;

  @Prop()
  shoeSize?: number;

  @Prop({ enum: Object.values(ShoesSizeUnitEnum) })
  shoeSizeUnit?: ShoesSizeUnitEnum;
}

@Schema({ _id: false })
class EducationSchema {
  @Prop()
  courseName?: string;

  @Prop()
  institution?: string;

  @Prop()
  startYear?: number;

  @Prop()
  endYear?: number;

  @Prop({ enum: Object.values(CourseTypeEnum) })
  courseType?: CourseTypeEnum;

  @Prop()
  isOngoing?: boolean;
}

@Schema({ _id: false })
class ProfessionalExperienceSchema {
  @Prop()
  companyName?: string;

  @Prop()
  role?: string;

  @Prop()
  startYear?: number;

  @Prop()
  endYear?: number;

  @Prop()
  isCurrent?: boolean;
}

@Schema({ _id: false })
class CandidateProfileSchema {
  @Prop({ type: CandidateDocumentsSchema })
  documents?: CandidateDocumentsSchema;

  @Prop({ type: CandidateContactsSchema })
  contacts?: CandidateContactsSchema;

  @Prop({ type: CandidateMediaSchema })
  media?: CandidateMediaSchema;

  @Prop({ enum: Object.values(EthnicityTypeEnum) })
  ethnicity?: EthnicityTypeEnum;

  @Prop({ type: DiversitySchema })
  diversity?: DiversitySchema;

  @Prop({ type: PhysicalAttributesSchema })
  physicalAttributes?: PhysicalAttributesSchema;

  @Prop({ type: UniformSchema })
  uniform?: UniformSchema;

  @Prop({ type: [EducationSchema] })
  educations?: EducationSchema[];

  @Prop({ type: [ProfessionalExperienceSchema] })
  professionalExperiences?: ProfessionalExperienceSchema[];

  @Prop({ type: [String], enum: Object.values(AvailabilityShiftEnum) })
  availability?: AvailabilityShiftEnum[];
}

@Schema({ _id: false })
class RecruiterProfileSchema {
  @Prop()
  companyId?: string;

  @Prop()
  position?: string;

  @Prop({ type: RecruiterContactsSchema })
  contacts?: RecruiterContactsSchema;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  birthday!: Date;

  @Prop({ type: CandidateProfileSchema })
  candidateProfile?: CandidateProfileSchema;

  @Prop({ type: RecruiterProfileSchema })
  recruiterProfile?: RecruiterProfileSchema;

  @Prop({
    enum: Object.values(ProductRoleEnum),
  })
  productRole?: ProductRoleEnum;

  @Prop({
    enum: Object.values(AdminRoleEnum),
  })
  adminRole?: AdminRoleEnum;

  @Prop({
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.PENDING,
    required: true,
  })
  status!: UserStatusEnum;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);

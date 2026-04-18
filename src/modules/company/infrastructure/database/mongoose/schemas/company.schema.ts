import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

export type CompanyDocument = HydratedDocument<CompanySchema>;

@Schema({ _id: false })
class PhoneSchema {
  @Prop()
  countryCode?: string;

  @Prop()
  areaCode?: string;

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
class ContactsSchema {
  @Prop({ required: true })
  email!: string;

  @Prop()
  website?: string;

  @Prop({ type: PhoneSchema, required: true })
  phone!: PhoneSchema;

  @Prop({ type: AddressSchema, required: true })
  address!: AddressSchema;

  @Prop({ type: SocialSchema })
  social?: SocialSchema;
}

@Schema({ _id: false })
class CompanyDocumentsSchema {
  @Prop()
  cnpj?: string;

  @Prop()
  isVerified?: boolean;
}

@Schema({ _id: false })
class CompanyMediaSchema {
  @Prop()
  logoUrl?: string;
}

@Schema({ _id: false })
class CompanyAuditSchema {
  @Prop()
  createdByUserId?: string;
}

@Schema({ _id: false })
class CompanyApprovalSchema {
  @Prop()
  approvedAt?: Date;

  @Prop()
  approvedByUserId?: string;
}

@Schema({
  collection: 'companies',
  timestamps: true,
})
export class CompanySchema {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  tradeName!: string;

  @Prop()
  legalName?: string;

  @Prop({ type: ContactsSchema, required: true })
  contacts!: ContactsSchema;

  @Prop({ type: CompanyDocumentsSchema, required: true })
  documents!: CompanyDocumentsSchema;

  @Prop({ type: CompanyMediaSchema, required: true })
  media!: CompanyMediaSchema;

  @Prop({ type: CompanyAuditSchema })
  audit?: CompanyAuditSchema;

  @Prop({ type: CompanyApprovalSchema })
  approval?: CompanyApprovalSchema;

  @Prop({
    required: true,
    enum: Object.values(CompanyStatusEnum),
  })
  status!: CompanyStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CompanySchemaFactory = SchemaFactory.createForClass(CompanySchema);

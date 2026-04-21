import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import type {
  CompanyApprovalEntity,
  CompanyAuditEntity,
  ContactsEntity,
} from '@src/modules/company/domain/entities/company.entity';
import type { CompanyDocumentsEntity } from '@src/modules/company/domain/entities/company-documents.entity';
import type { CompanyMediaEntity } from '@src/modules/company/domain/entities/company-media.entity';
import type { AddressEntity } from '@src/shared/domain/entities/address.entity';
import type { PhoneEntity } from '@src/shared/domain/entities/phone.entity';
import type { SocialEntity } from '@src/shared/domain/entities/social.entity';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';
import { SlugUtils } from '@src/shared/utils/slug.utils';

export type CompanyDocument = HydratedDocument<CompanySchema>;

@Schema({ _id: false })
class ContactsSchema {
  @Prop({ required: true })
  email!: string;

  @Prop()
  website?: string;

  @Prop({ type: Object, required: true })
  phone!: PhoneEntity;

  @Prop({ type: Object, required: true })
  address!: AddressEntity;

  @Prop({ type: Object })
  social?: SocialEntity;
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
  contacts!: ContactsEntity;

  @Prop({ type: Object, required: true })
  documents!: CompanyDocumentsEntity;

  @Prop({ type: Object, required: true })
  media!: CompanyMediaEntity;

  @Prop({ type: CompanyAuditSchema })
  audit?: CompanyAuditEntity;

  @Prop({ type: CompanyApprovalSchema })
  approval?: CompanyApprovalEntity;

  @Prop({
    required: true,
    enum: Object.values(CompanyStatusEnum),
  })
  status!: CompanyStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CompanySchemaFactory = SchemaFactory.createForClass(CompanySchema);

CompanySchemaFactory.pre('validate', function () {
  const cnpjUtils = new CnpjUtils();

  if (!this.slug) {
    this.slug = SlugUtils.generate(this.tradeName);
  }

  if (this.documents?.cnpj) {
    this.documents.cnpj = cnpjUtils.normalize(this.documents.cnpj);
  }
});

CompanySchemaFactory.index({ slug: 1 }, { unique: true });
CompanySchemaFactory.index(
  { 'documents.cnpj': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'documents.cnpj': { $exists: true, $type: 'string' },
    },
  },
);

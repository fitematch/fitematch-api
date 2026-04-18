import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

export type CompanyDocument = HydratedDocument<CompanySchema>;

@Schema({ _id: false })
class ContactsSchema {
  @Prop({ required: true })
  email!: string;

  @Prop()
  website?: string;

  @Prop({ type: Object, required: true })
  phone!: Record<string, unknown>;

  @Prop({ type: Object, required: true })
  address!: Record<string, unknown>;

  @Prop({ type: Object })
  social?: Record<string, unknown>;
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
  id!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  tradeName!: string;

  @Prop()
  legalName?: string;

  @Prop({ type: ContactsSchema, required: true })
  contacts!: ContactsSchema;

  @Prop({ type: Object, required: true })
  documents!: Record<string, unknown>;

  @Prop({ type: Object, required: true })
  media!: Record<string, unknown>;

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

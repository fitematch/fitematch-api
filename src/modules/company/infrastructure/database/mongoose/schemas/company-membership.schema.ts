import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';
import { CompanyMembershipStatusEnum } from '@src/modules/company/domain/enums/company-membership-status.enum';

export type CompanyMembershipDocument =
  HydratedDocument<CompanyMembershipSchema>;

@Schema({
  collection: 'company_memberships',
  timestamps: true,
})
export class CompanyMembershipSchema {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  companyId!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(CompanyMembershipRoleEnum),
  })
  role!: CompanyMembershipRoleEnum;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(CompanyMembershipStatusEnum),
  })
  status!: CompanyMembershipStatusEnum;

  @Prop()
  invitedBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CompanyMembershipSchemaFactory = SchemaFactory.createForClass(
  CompanyMembershipSchema,
);

CompanyMembershipSchemaFactory.index(
  { userId: 1, companyId: 1 },
  { unique: true },
);
CompanyMembershipSchemaFactory.index({ companyId: 1, status: 1 });
CompanyMembershipSchemaFactory.index({ userId: 1, status: 1 });

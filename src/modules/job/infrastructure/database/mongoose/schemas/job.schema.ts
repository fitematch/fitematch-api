import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

export type JobDocument = HydratedDocument<JobSchema>;

@Schema({ _id: false })
class LanguageRequirementSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  level!: string;
}

@Schema({ _id: false })
class SkillGroupSchema {
  @Prop({ type: [String] })
  required?: string[];

  @Prop({ type: [String] })
  niceToHave?: string[];
}

@Schema({ _id: false })
class RequirementsSchema {
  @Prop({ type: [String] })
  educationLevel?: string[];

  @Prop()
  minExperienceYears?: number;

  @Prop()
  maxExperienceYears?: number;

  @Prop({ type: [LanguageRequirementSchema] })
  languages?: LanguageRequirementSchema[];

  @Prop({ type: SkillGroupSchema })
  hardSkills?: SkillGroupSchema;

  @Prop({ type: SkillGroupSchema })
  softSkills?: SkillGroupSchema;
}

@Schema({ _id: false })
class BenefitsSchema {
  @Prop()
  salary?: number;

  @Prop()
  healthInsurance?: boolean;

  @Prop()
  dentalInsurance?: boolean;

  @Prop()
  alimentationVoucher?: boolean;

  @Prop()
  transportationVoucher?: boolean;
}

@Schema({
  collection: 'jobs',
  timestamps: true,
})
export class JobSchema {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  companyId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  slots!: number;

  @Prop({ type: RequirementsSchema })
  requirements?: RequirementsSchema;

  @Prop({ type: BenefitsSchema })
  benefits?: BenefitsSchema;

  @Prop({
    required: true,
    enum: Object.values(JobStatusEnum),
  })
  status!: JobStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobSchemaFactory = SchemaFactory.createForClass(JobSchema);

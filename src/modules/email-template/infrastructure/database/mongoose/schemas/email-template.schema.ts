import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailTemplateDocument = HydratedDocument<EmailTemplateSchema>;

@Schema({ _id: false })
class EmailTemplateVariableSchema {
  @Prop({ required: true })
  key!: string;

  @Prop({ required: true })
  description!: string;
}

@Schema({
  collection: 'email_templates',
  timestamps: true,
})
export class EmailTemplateSchema {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: String })
  description?: string | null;

  @Prop({ required: true })
  subject!: string;

  @Prop({ type: String })
  preheader?: string | null;

  @Prop({ required: true })
  body!: string;

  @Prop({ required: true })
  defaultSubject!: string;

  @Prop({ type: String })
  defaultPreheader?: string | null;

  @Prop({ required: true })
  defaultBody!: string;

  @Prop({ type: [EmailTemplateVariableSchema], default: [] })
  variables!: EmailTemplateVariableSchema[];

  @Prop({ required: true, default: true })
  isSystem!: boolean;

  @Prop({ required: true, default: true })
  isActive!: boolean;

  @Prop({ type: String })
  category?: string | null;

  @Prop({ required: true, default: 1 })
  version!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EmailTemplateSchemaFactory =
  SchemaFactory.createForClass(EmailTemplateSchema);

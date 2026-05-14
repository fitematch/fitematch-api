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
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ required: true })
  preheader!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ required: true })
  defaultSubject!: string;

  @Prop({ required: true })
  defaultPreheader!: string;

  @Prop({ required: true })
  defaultBody!: string;

  @Prop({ type: [EmailTemplateVariableSchema], default: [] })
  variables!: EmailTemplateVariableSchema[];

  @Prop({ required: true, default: true })
  isSystem!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EmailTemplateSchemaFactory =
  SchemaFactory.createForClass(EmailTemplateSchema);

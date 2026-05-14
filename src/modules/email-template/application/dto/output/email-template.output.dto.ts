import type { EmailTemplateVariableEntity } from '@src/modules/email-template/domain/entities/email-template.entity';

export class EmailTemplateOutputDto {
  id!: string;
  slug!: string;
  name!: string;
  description!: string;
  subject!: string;
  preheader!: string;
  body!: string;
  defaultSubject!: string;
  defaultPreheader!: string;
  defaultBody!: string;
  variables!: EmailTemplateVariableEntity[];
  isSystem!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

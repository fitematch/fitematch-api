import type { EmailTemplateVariableEntity } from '@src/modules/email-template/domain/entities/email-template.entity';

export class EmailTemplateOutputDto {
  slug!: string;
  name!: string;
  description?: string | null;
  subject!: string;
  preheader?: string | null;
  body!: string;
  defaultSubject!: string;
  defaultPreheader?: string | null;
  defaultBody!: string;
  variables!: EmailTemplateVariableEntity[];
  isSystem!: boolean;
  isActive!: boolean;
  category?: string | null;
  version!: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

type EmailTemplateDocumentLike = {
  slug: string;
  name: string;
  description?: string | null;
  subject: string;
  preheader?: string | null;
  body: string;
  defaultSubject: string;
  defaultPreheader?: string | null;
  defaultBody: string;
  variables: {
    key: string;
    description: string;
  }[];
  isSystem: boolean;
  isActive: boolean;
  category?: string | null;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class EmailTemplateRepositoryMapper {
  static toOutput(template: EmailTemplateDocumentLike): EmailTemplateOutputDto {
    return {
      slug: template.slug,
      name: template.name,
      description: template.description,
      subject: template.subject,
      preheader: template.preheader,
      body: template.body,
      defaultSubject: template.defaultSubject,
      defaultPreheader: template.defaultPreheader,
      defaultBody: template.defaultBody,
      variables: template.variables,
      isSystem: template.isSystem,
      isActive: template.isActive,
      category: template.category,
      version: template.version,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}

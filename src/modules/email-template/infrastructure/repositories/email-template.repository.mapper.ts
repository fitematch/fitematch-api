import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

type EmailTemplateDocumentLike = {
  _id: { toString(): string };
  slug: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  body: string;
  defaultSubject: string;
  defaultPreheader: string;
  defaultBody: string;
  variables: {
    key: string;
    description: string;
  }[];
  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class EmailTemplateRepositoryMapper {
  static toOutput(template: EmailTemplateDocumentLike): EmailTemplateOutputDto {
    return {
      id: template._id.toString(),
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
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}

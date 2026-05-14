export interface EmailTemplateVariableEntity {
  key: string;
  description: string;
}

export interface EmailTemplateEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  body: string;
  defaultSubject: string;
  defaultPreheader: string;
  defaultBody: string;
  variables: EmailTemplateVariableEntity[];
  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

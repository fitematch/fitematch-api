export interface EmailTemplateVariableEntity {
  key: string;
  description: string;
}

export interface EmailTemplateEntity {
  slug: string;
  name: string;
  description?: string | null;
  subject: string;
  preheader?: string | null;
  body: string;
  defaultSubject: string;
  defaultPreheader?: string | null;
  defaultBody: string;
  variables: EmailTemplateVariableEntity[];
  isSystem: boolean;
  isActive: boolean;
  category?: string | null;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}

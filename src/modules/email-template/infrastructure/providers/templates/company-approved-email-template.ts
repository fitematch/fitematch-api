import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const companyApprovedEmailTemplate: DefaultEmailTemplateDefinition = {
  slug: 'company-approved',
  name: 'Company Approved',
  description: 'Template sent when a company is approved.',
  subject: 'Empresa aprovada: {{companyName}}',
  preheader: 'A empresa {{companyName}} foi aprovada na fitematch.',
  body: `
      <h1>Olá, {{userName}}</h1>
      <p>A empresa <strong>{{companyName}}</strong> foi aprovada com sucesso.</p>
      <p>Você já pode seguir com as próximas etapas na plataforma.</p>
    `,
  defaultSubject: 'Empresa aprovada: {{companyName}}',
  defaultPreheader: 'A empresa {{companyName}} foi aprovada na fitematch.',
  defaultBody: `
      <h1>Olá, {{userName}}</h1>
      <p>A empresa <strong>{{companyName}}</strong> foi aprovada com sucesso.</p>
      <p>Você já pode seguir com as próximas etapas na plataforma.</p>
    `,
  variables: [
    commonEmailTemplateVariables.userName,
    commonEmailTemplateVariables.companyName,
  ],
  isSystem: true,
};

import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const companyRejectedEmailTemplate: DefaultEmailTemplateDefinition = {
  slug: 'company-rejected',
  name: 'Company Rejected',
  description: 'Template sent when a company is rejected.',
  subject: 'Empresa recusada: {{companyName}}',
  preheader: 'A empresa {{companyName}} precisa de ajustes para aprovação.',
  body: `
      <h1>Olá, {{userName}}</h1>
      <p>A empresa <strong>{{companyName}}</strong> não foi aprovada neste momento.</p>
      <p>Motivo informado: {{reason}}</p>
    `,
  defaultSubject: 'Empresa recusada: {{companyName}}',
  defaultPreheader:
    'A empresa {{companyName}} precisa de ajustes para aprovação.',
  defaultBody: `
      <h1>Olá, {{userName}}</h1>
      <p>A empresa <strong>{{companyName}}</strong> não foi aprovada neste momento.</p>
      <p>Motivo informado: {{reason}}</p>
    `,
  variables: [
    commonEmailTemplateVariables.userName,
    commonEmailTemplateVariables.companyName,
    commonEmailTemplateVariables.reason,
  ],
  isSystem: true,
};

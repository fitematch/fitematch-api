import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const jobRejectedEmailTemplate: DefaultEmailTemplateDefinition = {
  slug: 'job-rejected',
  name: 'Job Rejected',
  description: 'Template sent when a job is rejected.',
  subject: 'Vaga recusada: {{jobTitle}}',
  preheader: 'A vaga {{jobTitle}} precisa de ajustes antes da publicação.',
  body: `
      <h1>Olá, {{userName}}</h1>
      <p>A vaga <strong>{{jobTitle}}</strong> da empresa <strong>{{companyName}}</strong> não foi aprovada.</p>
      <p>Motivo informado: {{reason}}</p>
    `,
  defaultSubject: 'Vaga recusada: {{jobTitle}}',
  defaultPreheader:
    'A vaga {{jobTitle}} precisa de ajustes antes da publicação.',
  defaultBody: `
      <h1>Olá, {{userName}}</h1>
      <p>A vaga <strong>{{jobTitle}}</strong> da empresa <strong>{{companyName}}</strong> não foi aprovada.</p>
      <p>Motivo informado: {{reason}}</p>
    `,
  variables: [
    commonEmailTemplateVariables.userName,
    commonEmailTemplateVariables.companyName,
    commonEmailTemplateVariables.jobTitle,
    commonEmailTemplateVariables.reason,
  ],
  isSystem: true,
};

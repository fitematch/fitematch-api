import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const jobApprovedEmailTemplate: DefaultEmailTemplateDefinition = {
  slug: 'job-approved',
  name: 'Job Approved',
  description: 'Template sent when a job is approved.',
  subject: 'Vaga aprovada: {{jobTitle}}',
  preheader: 'A vaga {{jobTitle}} foi aprovada e está pronta para publicação.',
  body: `
      <h1>Olá, {{userName}}</h1>
      <p>A vaga <strong>{{jobTitle}}</strong> da empresa <strong>{{companyName}}</strong> foi aprovada.</p>
    `,
  defaultSubject: 'Vaga aprovada: {{jobTitle}}',
  defaultPreheader:
    'A vaga {{jobTitle}} foi aprovada e está pronta para publicação.',
  defaultBody: `
      <h1>Olá, {{userName}}</h1>
      <p>A vaga <strong>{{jobTitle}}</strong> da empresa <strong>{{companyName}}</strong> foi aprovada.</p>
    `,
  variables: [
    commonEmailTemplateVariables.userName,
    commonEmailTemplateVariables.companyName,
    commonEmailTemplateVariables.jobTitle,
  ],
  isSystem: true,
  isActive: true,
  category: 'job',
  version: 1,
};

import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const applicationStatusUpdatedEmailTemplate: DefaultEmailTemplateDefinition =
  {
    slug: 'application-status-updated',
    name: 'Application Status Updated',
    description: 'Template sent when an application status changes.',
    subject: 'Status da candidatura atualizado: {{applicationStatus}}',
    preheader:
      'Sua candidatura para {{jobTitle}} agora está como {{applicationStatus}}.',
    body: `
      <h1>Olá, {{candidateName}}</h1>
      <p>A sua candidatura para a vaga <strong>{{jobTitle}}</strong> na empresa <strong>{{companyName}}</strong> foi atualizada para <strong>{{applicationStatus}}</strong>.</p>
      <p>{{reason}}</p>
    `,
    defaultSubject: 'Status da candidatura atualizado: {{applicationStatus}}',
    defaultPreheader:
      'Sua candidatura para {{jobTitle}} agora está como {{applicationStatus}}.',
    defaultBody: `
      <h1>Olá, {{candidateName}}</h1>
      <p>A sua candidatura para a vaga <strong>{{jobTitle}}</strong> na empresa <strong>{{companyName}}</strong> foi atualizada para <strong>{{applicationStatus}}</strong>.</p>
      <p>{{reason}}</p>
    `,
    variables: [
      commonEmailTemplateVariables.candidateName,
      commonEmailTemplateVariables.companyName,
      commonEmailTemplateVariables.jobTitle,
      commonEmailTemplateVariables.applicationStatus,
      commonEmailTemplateVariables.reason,
    ],
    isSystem: true,
    isActive: true,
    category: 'application',
    version: 1,
  };

import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const applicationReceivedEmailTemplate: DefaultEmailTemplateDefinition =
  {
    slug: 'application-received',
    name: 'Application Received',
    description: 'Template sent when an application is received.',
    subject: 'Candidatura recebida para {{jobTitle}}',
    preheader: 'Recebemos a candidatura de {{candidateName}} com sucesso.',
    body: `
      <h1>Olá, {{candidateName}}</h1>
      <p>Sua candidatura para a vaga <strong>{{jobTitle}}</strong> na empresa <strong>{{companyName}}</strong> foi recebida.</p>
    `,
    defaultSubject: 'Candidatura recebida para {{jobTitle}}',
    defaultPreheader:
      'Recebemos a candidatura de {{candidateName}} com sucesso.',
    defaultBody: `
      <h1>Olá, {{candidateName}}</h1>
      <p>Sua candidatura para a vaga <strong>{{jobTitle}}</strong> na empresa <strong>{{companyName}}</strong> foi recebida.</p>
    `,
    variables: [
      commonEmailTemplateVariables.candidateName,
      commonEmailTemplateVariables.companyName,
      commonEmailTemplateVariables.jobTitle,
    ],
    isSystem: true,
  };

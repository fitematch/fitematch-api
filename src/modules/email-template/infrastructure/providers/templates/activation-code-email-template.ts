import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { commonEmailTemplateVariables } from '@src/modules/email-template/infrastructure/providers/templates/common-email-template.variables';

export const activationCodeEmailTemplate: DefaultEmailTemplateDefinition = {
  slug: 'activation-code',
  name: 'Activation Code',
  description: 'Template used to send account activation codes.',
  subject: 'Seu codigo de ativacao, {{userName}}',
  preheader: 'Use este codigo para ativar sua conta na fitematch.',
  body: `
      <h1>Olá, {{userName}}</h1>
      <p>Use o código <strong>{{activationCode}}</strong> para ativar sua conta na fitematch.</p>
      <p>Se você não solicitou este acesso, ignore este email.</p>
    `,
  defaultSubject: 'Seu codigo de ativacao, {{userName}}',
  defaultPreheader: 'Use este codigo para ativar sua conta na fitematch.',
  defaultBody: `
      <h1>Olá, {{userName}}</h1>
      <p>Use o código <strong>{{activationCode}}</strong> para ativar sua conta na fitematch.</p>
      <p>Se você não solicitou este acesso, ignore este email.</p>
    `,
  variables: [
    commonEmailTemplateVariables.userName,
    commonEmailTemplateVariables.activationCode,
  ],
  isSystem: true,
};

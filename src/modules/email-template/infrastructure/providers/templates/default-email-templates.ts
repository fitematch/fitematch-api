import type { DefaultEmailTemplateDefinition } from '@src/modules/email-template/infrastructure/providers/templates/default-email-template-definition.interface';
import { activationCodeEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/activation-code-email-template';
import { companyApprovedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/company-approved-email-template';
import { companyRejectedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/company-rejected-email-template';
import { jobApprovedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/job-approved-email-template';
import { jobRejectedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/job-rejected-email-template';
import { applicationReceivedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/application-received-email-template';
import { applicationStatusUpdatedEmailTemplate } from '@src/modules/email-template/infrastructure/providers/templates/application-status-updated-email-template';

export const defaultEmailTemplates: DefaultEmailTemplateDefinition[] = [
  activationCodeEmailTemplate,
  companyApprovedEmailTemplate,
  companyRejectedEmailTemplate,
  jobApprovedEmailTemplate,
  jobRejectedEmailTemplate,
  applicationReceivedEmailTemplate,
  applicationStatusUpdatedEmailTemplate,
];

import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

export interface ListEmailTemplateRepositoryInterface {
  ensureDefaults(): Promise<void>;
  list(): Promise<EmailTemplateOutputDto[]>;
}

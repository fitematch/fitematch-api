import type { ResetEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/reset-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

export interface ResetEmailTemplateRepositoryInterface {
  ensureDefaults(): Promise<void>;
  reset(
    input: ResetEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null>;
}

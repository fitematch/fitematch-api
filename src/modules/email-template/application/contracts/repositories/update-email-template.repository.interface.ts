import type { UpdateEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/update-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

export interface UpdateEmailTemplateRepositoryInterface {
  ensureDefaults(): Promise<void>;
  update(
    input: UpdateEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null>;
}

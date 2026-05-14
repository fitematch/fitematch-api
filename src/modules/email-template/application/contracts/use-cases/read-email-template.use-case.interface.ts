import type { ReadEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/read-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

export interface ReadEmailTemplateUseCaseInterface {
  execute(
    input: ReadEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null>;
}

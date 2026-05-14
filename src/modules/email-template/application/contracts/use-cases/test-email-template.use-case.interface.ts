import type { TestEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/test-email-template.input.dto';
import type { TestEmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/test-email-template.output.dto';

export interface TestEmailTemplateUseCaseInterface {
  execute(
    input: TestEmailTemplateInputDto,
  ): Promise<TestEmailTemplateOutputDto | null>;
}

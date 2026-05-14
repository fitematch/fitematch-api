import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { EmailProviderInterface } from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import { TEST_EMAIL_TEMPLATE_REPOSITORY } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { TestEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/test-email-template.repository.interface';
import type { TestEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/test-email-template.use-case.interface';
import type { ReadEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/read-email-template.input.dto';
import type { TestEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/test-email-template.input.dto';
import type { TestEmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/test-email-template.output.dto';
import { EmailTemplateRenderer } from '@src/modules/email-template/infrastructure/providers/email-template.renderer';

@Injectable()
export class TestEmailTemplateUseCase implements TestEmailTemplateUseCaseInterface {
  constructor(
    @Inject(TEST_EMAIL_TEMPLATE_REPOSITORY)
    private readonly testEmailTemplateRepository: TestEmailTemplateRepositoryInterface,
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProviderInterface,
  ) {}

  async execute(
    input: TestEmailTemplateInputDto,
  ): Promise<TestEmailTemplateOutputDto | null> {
    await this.testEmailTemplateRepository.ensureDefaults();

    const templateInput: ReadEmailTemplateInputDto = {
      id: input.id,
    };

    const template = await this.testEmailTemplateRepository.read(templateInput);

    if (!template) {
      return null;
    }

    const variables = EmailTemplateRenderer.getFakeVariables();

    await this.emailProvider.sendEmail({
      to: input.email,
      subject: EmailTemplateRenderer.render(template.subject, variables),
      html: EmailTemplateRenderer.buildHtml({
        preheader: EmailTemplateRenderer.render(template.preheader, variables),
        body: EmailTemplateRenderer.render(template.body, variables),
      }),
    });

    return {
      message: 'Test email sent successfully.',
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RESET_EMAIL_TEMPLATE_REPOSITORY } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ResetEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/reset-email-template.repository.interface';
import type { ResetEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/reset-email-template.use-case.interface';
import type { ResetEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/reset-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

@Injectable()
export class ResetEmailTemplateUseCase implements ResetEmailTemplateUseCaseInterface {
  constructor(
    @Inject(RESET_EMAIL_TEMPLATE_REPOSITORY)
    private readonly resetEmailTemplateRepository: ResetEmailTemplateRepositoryInterface,
  ) {}

  async execute(
    input: ResetEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    await this.resetEmailTemplateRepository.ensureDefaults();

    return this.resetEmailTemplateRepository.reset(input);
  }
}

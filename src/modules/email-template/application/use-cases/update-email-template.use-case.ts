import { Inject, Injectable } from '@nestjs/common';
import { UPDATE_EMAIL_TEMPLATE_REPOSITORY } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { UpdateEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/update-email-template.repository.interface';
import type { UpdateEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/update-email-template.use-case.interface';
import type { UpdateEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/update-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

@Injectable()
export class UpdateEmailTemplateUseCase implements UpdateEmailTemplateUseCaseInterface {
  constructor(
    @Inject(UPDATE_EMAIL_TEMPLATE_REPOSITORY)
    private readonly updateEmailTemplateRepository: UpdateEmailTemplateRepositoryInterface,
  ) {}

  async execute(
    input: UpdateEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    await this.updateEmailTemplateRepository.ensureDefaults();

    return this.updateEmailTemplateRepository.update(input);
  }
}

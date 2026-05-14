import { Inject, Injectable } from '@nestjs/common';
import { LIST_EMAIL_TEMPLATE_REPOSITORY } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ListEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/list-email-template.repository.interface';
import type { ListEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/list-email-template.use-case.interface';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

@Injectable()
export class ListEmailTemplateUseCase implements ListEmailTemplateUseCaseInterface {
  constructor(
    @Inject(LIST_EMAIL_TEMPLATE_REPOSITORY)
    private readonly listEmailTemplateRepository: ListEmailTemplateRepositoryInterface,
  ) {}

  async execute(): Promise<EmailTemplateOutputDto[]> {
    await this.listEmailTemplateRepository.ensureDefaults();

    return this.listEmailTemplateRepository.list();
  }
}

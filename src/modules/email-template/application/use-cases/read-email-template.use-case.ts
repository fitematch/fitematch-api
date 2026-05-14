import { Inject, Injectable } from '@nestjs/common';
import { READ_EMAIL_TEMPLATE_REPOSITORY } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ReadEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/read-email-template.repository.interface';
import type { ReadEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/read-email-template.use-case.interface';
import type { ReadEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/read-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

@Injectable()
export class ReadEmailTemplateUseCase implements ReadEmailTemplateUseCaseInterface {
  constructor(
    @Inject(READ_EMAIL_TEMPLATE_REPOSITORY)
    private readonly readEmailTemplateRepository: ReadEmailTemplateRepositoryInterface,
  ) {}

  async execute(
    input: ReadEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    await this.readEmailTemplateRepository.ensureDefaults();

    return this.readEmailTemplateRepository.read(input);
  }
}

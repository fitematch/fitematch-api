import type { Provider } from '@nestjs/common';
import {
  LIST_EMAIL_TEMPLATE_REPOSITORY,
  LIST_EMAIL_TEMPLATE_USE_CASE,
  READ_EMAIL_TEMPLATE_REPOSITORY,
  READ_EMAIL_TEMPLATE_USE_CASE,
  RESET_EMAIL_TEMPLATE_REPOSITORY,
  RESET_EMAIL_TEMPLATE_USE_CASE,
  TEST_EMAIL_TEMPLATE_REPOSITORY,
  TEST_EMAIL_TEMPLATE_USE_CASE,
  UPDATE_EMAIL_TEMPLATE_REPOSITORY,
  UPDATE_EMAIL_TEMPLATE_USE_CASE,
} from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import { ListEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/list-email-template.use-case';
import { ReadEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/read-email-template.use-case';
import { UpdateEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/update-email-template.use-case';
import { ResetEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/reset-email-template.use-case';
import { TestEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/test-email-template.use-case';
import { ListEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/list-email-template.repository';
import { ReadEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/read-email-template.repository';
import { UpdateEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/update-email-template.repository';
import { ResetEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/reset-email-template.repository';
import { TestEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/test-email-template.repository';

export const emailTemplateProviders: Provider[] = [
  {
    provide: LIST_EMAIL_TEMPLATE_USE_CASE,
    useClass: ListEmailTemplateUseCase,
  },
  {
    provide: LIST_EMAIL_TEMPLATE_REPOSITORY,
    useClass: ListEmailTemplateRepository,
  },
  {
    provide: READ_EMAIL_TEMPLATE_USE_CASE,
    useClass: ReadEmailTemplateUseCase,
  },
  {
    provide: READ_EMAIL_TEMPLATE_REPOSITORY,
    useClass: ReadEmailTemplateRepository,
  },
  {
    provide: UPDATE_EMAIL_TEMPLATE_USE_CASE,
    useClass: UpdateEmailTemplateUseCase,
  },
  {
    provide: UPDATE_EMAIL_TEMPLATE_REPOSITORY,
    useClass: UpdateEmailTemplateRepository,
  },
  {
    provide: RESET_EMAIL_TEMPLATE_USE_CASE,
    useClass: ResetEmailTemplateUseCase,
  },
  {
    provide: RESET_EMAIL_TEMPLATE_REPOSITORY,
    useClass: ResetEmailTemplateRepository,
  },
  {
    provide: TEST_EMAIL_TEMPLATE_USE_CASE,
    useClass: TestEmailTemplateUseCase,
  },
  {
    provide: TEST_EMAIL_TEMPLATE_REPOSITORY,
    useClass: TestEmailTemplateRepository,
  },
];

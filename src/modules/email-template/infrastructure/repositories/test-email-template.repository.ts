import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { TestEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/test-email-template.repository.interface';
import type { ReadEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/read-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';
import {
  EmailTemplateSchema,
  type EmailTemplateDocument,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { ensureDefaultEmailTemplates } from '@src/modules/email-template/infrastructure/repositories/email-template-defaults.helper';
import { EmailTemplateRepositoryMapper } from '@src/modules/email-template/infrastructure/repositories/email-template.repository.mapper';

@Injectable()
export class TestEmailTemplateRepository implements TestEmailTemplateRepositoryInterface {
  constructor(
    @InjectModel(EmailTemplateSchema.name)
    private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {}

  async ensureDefaults(): Promise<void> {
    await ensureDefaultEmailTemplates(this.emailTemplateModel);
  }

  async read(
    input: ReadEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    const template = await this.emailTemplateModel
      .findById(input.id)
      .lean()
      .exec();

    return template ? EmailTemplateRepositoryMapper.toOutput(template) : null;
  }
}

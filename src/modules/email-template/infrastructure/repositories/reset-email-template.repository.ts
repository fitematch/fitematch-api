import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ResetEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/reset-email-template.repository.interface';
import type { ResetEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/reset-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';
import {
  EmailTemplateSchema,
  type EmailTemplateDocument,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { ensureDefaultEmailTemplates } from '@src/modules/email-template/infrastructure/repositories/email-template-defaults.helper';
import { EmailTemplateRepositoryMapper } from '@src/modules/email-template/infrastructure/repositories/email-template.repository.mapper';

@Injectable()
export class ResetEmailTemplateRepository implements ResetEmailTemplateRepositoryInterface {
  constructor(
    @InjectModel(EmailTemplateSchema.name)
    private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {}

  async ensureDefaults(): Promise<void> {
    await ensureDefaultEmailTemplates(this.emailTemplateModel);
  }

  async reset(
    input: ResetEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    const template = await this.emailTemplateModel.findById(input.id).exec();

    if (!template) {
      return null;
    }

    template.subject = template.defaultSubject;
    template.preheader = template.defaultPreheader;
    template.body = template.defaultBody;

    await template.save();

    return EmailTemplateRepositoryMapper.toOutput(template);
  }
}

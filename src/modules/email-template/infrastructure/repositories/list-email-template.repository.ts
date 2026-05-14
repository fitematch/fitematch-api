import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ListEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/list-email-template.repository.interface';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';
import {
  EmailTemplateSchema,
  type EmailTemplateDocument,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { ensureDefaultEmailTemplates } from '@src/modules/email-template/infrastructure/repositories/email-template-defaults.helper';
import { EmailTemplateRepositoryMapper } from '@src/modules/email-template/infrastructure/repositories/email-template.repository.mapper';

@Injectable()
export class ListEmailTemplateRepository implements ListEmailTemplateRepositoryInterface {
  constructor(
    @InjectModel(EmailTemplateSchema.name)
    private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {}

  async ensureDefaults(): Promise<void> {
    await ensureDefaultEmailTemplates(this.emailTemplateModel);
  }

  async list(): Promise<EmailTemplateOutputDto[]> {
    const templates = await this.emailTemplateModel
      .find()
      .sort({ createdAt: 1, slug: 1 })
      .lean()
      .exec();

    return templates.map((template) =>
      EmailTemplateRepositoryMapper.toOutput(template),
    );
  }
}

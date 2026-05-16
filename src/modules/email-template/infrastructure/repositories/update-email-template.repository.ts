import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { UpdateEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/update-email-template.repository.interface';
import type { UpdateEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/update-email-template.input.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';
import {
  EmailTemplateSchema,
  type EmailTemplateDocument,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { ensureDefaultEmailTemplates } from '@src/modules/email-template/infrastructure/repositories/email-template-defaults.helper';
import { EmailTemplateRepositoryMapper } from '@src/modules/email-template/infrastructure/repositories/email-template.repository.mapper';

@Injectable()
export class UpdateEmailTemplateRepository implements UpdateEmailTemplateRepositoryInterface {
  constructor(
    @InjectModel(EmailTemplateSchema.name)
    private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {}

  async ensureDefaults(): Promise<void> {
    await ensureDefaultEmailTemplates(this.emailTemplateModel);
  }

  async update(
    input: UpdateEmailTemplateInputDto,
  ): Promise<EmailTemplateOutputDto | null> {
    const template = await this.emailTemplateModel
      .findOneAndUpdate(
        { slug: input.slug.trim().toLowerCase() },
        {
          $set: {
            name: input.name,
            description: input.description,
            subject: input.subject,
            preheader: input.preheader,
            body: input.body,
            isActive: input.isActive,
            category: input.category,
          },
        },
        { new: true },
      )
      .lean()
      .exec();

    return template ? EmailTemplateRepositoryMapper.toOutput(template) : null;
  }
}

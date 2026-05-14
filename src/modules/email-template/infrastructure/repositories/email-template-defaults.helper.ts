import type { Model } from 'mongoose';
import type { EmailTemplateDocument } from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { defaultEmailTemplates } from '@src/modules/email-template/infrastructure/providers/templates/default-email-templates';

export async function ensureDefaultEmailTemplates(
  emailTemplateModel: Model<EmailTemplateDocument>,
): Promise<void> {
  await emailTemplateModel.bulkWrite(
    defaultEmailTemplates.map((template) => ({
      updateOne: {
        filter: { slug: template.slug },
        update: {
          $setOnInsert: template,
        },
        upsert: true,
      },
    })),
  );
}

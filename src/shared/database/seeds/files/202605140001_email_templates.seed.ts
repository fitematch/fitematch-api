import {
  EmailTemplateSchema,
  type EmailTemplateDocument,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
import { defaultEmailTemplates } from '@src/modules/email-template/infrastructure/providers/templates/default-email-templates';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const seed: SeedInterface = {
  name: '202605140001_email_templates.seed.ts',

  async run({ connection, logger, session }) {
    const emailTemplateModel = connection.model<EmailTemplateDocument>(
      EmailTemplateSchema.name,
    );

    await Promise.all(
      defaultEmailTemplates.map((template) =>
        emailTemplateModel.updateOne(
          { slug: template.slug },
          {
            $setOnInsert: {
              slug: template.slug,
              subject: template.subject,
              preheader: template.preheader,
              body: template.body,
            },
            $set: {
              name: template.name,
              description: template.description,
              defaultSubject: template.defaultSubject,
              defaultPreheader: template.defaultPreheader,
              defaultBody: template.defaultBody,
              variables: template.variables,
              isSystem: template.isSystem,
              isActive: template.isActive,
              category: template.category,
              version: template.version,
            },
          },
          {
            upsert: true,
            session,
          },
        ),
      ),
    );

    logger.log('Email template seed executed with idempotent upserts.');
  },

  async rollback({ connection, logger, session }) {
    await Promise.resolve();

    void connection;
    void session;

    logger.log(
      'Email template seed rollback is a no-op to preserve production customizations.',
    );
  },
};

export default seed;

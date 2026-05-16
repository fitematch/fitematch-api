import type { MigrationInterface } from '@src/shared/database/migrations/contracts/migration.interface';

const migration: MigrationInterface = {
  name: '202605140001_create_email_templates.migration.ts',

  async up({ connection, logger }) {
    const emailTemplateCollection = connection.collection('email_templates');
    const indexes = await emailTemplateCollection.indexes();
    const slugIndex = indexes.find((index) => {
      return (
        index.key && JSON.stringify(index.key) === JSON.stringify({ slug: 1 })
      );
    });

    if (slugIndex?.name === 'email_templates_slug_unique') {
      logger.log('Unique index already configured for email_templates.slug');
      return;
    }

    if (slugIndex?.name) {
      await emailTemplateCollection.dropIndex(slugIndex.name);
      logger.log(
        `Existing slug index dropped for recreation: ${slugIndex.name}`,
      );
    }

    await emailTemplateCollection.createIndex(
      { slug: 1 },
      {
        unique: true,
        name: 'email_templates_slug_unique',
      },
    );

    logger.log('Unique index created for email_templates.slug');
  },

  async down({ connection, logger }) {
    try {
      await connection
        .collection('email_templates')
        .dropIndex('email_templates_slug_unique');

      logger.log('Unique index removed for email_templates.slug');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown index rollback error';

      logger.warn(
        `Skipping index rollback for email_templates.slug: ${message}`,
      );
    }
  },
};

export default migration;

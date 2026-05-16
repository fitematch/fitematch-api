import type { MigrationInterface } from '@src/shared/database/migrations/contracts/migration.interface';

const migration: MigrationInterface = {
  name: '202605150001_sync_email_templates_contract.migration.ts',

  async up({ connection, logger }) {
    const emailTemplateCollection = connection.collection('email_templates');

    await emailTemplateCollection.updateMany({}, [
      {
        $set: {
          slug: { $toLower: { $trim: { input: '$slug' } } },
          isActive: { $ifNull: ['$isActive', true] },
          version: { $ifNull: ['$version', 1] },
          category: { $ifNull: ['$category', null] },
          description: { $ifNull: ['$description', null] },
          preheader: { $ifNull: ['$preheader', null] },
          defaultPreheader: { $ifNull: ['$defaultPreheader', null] },
        },
      },
    ]);

    await emailTemplateCollection.dropIndexes().catch(() => undefined);
    await emailTemplateCollection.createIndex(
      { slug: 1 },
      {
        unique: true,
        name: 'email_templates_slug_unique',
      },
    );

    logger.log('Email template contract synchronized.');
  },

  async down({ logger }) {
    await Promise.resolve();

    logger.log(
      'Email template contract rollback is a no-op to avoid destructive production changes.',
    );
  },
};

export default migration;

import type { MigrationInterface } from '@src/shared/database/migrations/contracts/migration.interface';

interface LegacyCompany {
  _id?: unknown;
  audit?: {
    createdByUserId?: unknown;
  };
}

interface LegacyRecruiter {
  _id?: unknown;
  recruiterProfile?: {
    companyId?: unknown;
  };
}

interface ObjectIdLike {
  toHexString(): string;
}

function isObjectIdLike(value: unknown): value is ObjectIdLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toHexString' in value &&
    typeof (value as Record<'toHexString', unknown>).toHexString === 'function'
  );
}

function toLegacyId(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (isObjectIdLike(value)) {
    return value.toHexString();
  }

  return null;
}

const migration: MigrationInterface = {
  name: '202605200001_backfill_company_memberships.migration.ts',

  async up({ connection, logger }) {
    const companies = connection.collection('companies');
    const users = connection.collection('users');
    const memberships = connection.collection('company_memberships');
    const now = new Date();

    await memberships.createIndex(
      { userId: 1, companyId: 1 },
      { unique: true, name: 'company_memberships_user_company_unique' },
    );
    await memberships.createIndex(
      { companyId: 1, status: 1 },
      { name: 'company_memberships_company_status' },
    );
    await memberships.createIndex(
      { userId: 1, status: 1 },
      { name: 'company_memberships_user_status' },
    );

    const operations: Array<{
      updateOne: {
        filter: { userId: string; companyId: string };
        update: {
          $setOnInsert: {
            userId: string;
            companyId: string;
            role: 'owner';
            status: 'active';
            invitedBy?: string;
            createdAt: Date;
            updatedAt: Date;
          };
        };
        upsert: true;
      };
    }> = [];

    const pushOwnerMembership = (
      userId: unknown,
      companyId: unknown,
      invitedBy?: string,
    ) => {
      const normalizedUserId = toLegacyId(userId);
      const normalizedCompanyId = toLegacyId(companyId);

      if (!normalizedUserId || !normalizedCompanyId) {
        return;
      }

      operations.push({
        updateOne: {
          filter: {
            userId: normalizedUserId,
            companyId: normalizedCompanyId,
          },
          update: {
            $setOnInsert: {
              userId: normalizedUserId,
              companyId: normalizedCompanyId,
              role: 'owner',
              status: 'active',
              invitedBy,
              createdAt: now,
              updatedAt: now,
            },
          },
          upsert: true,
        },
      });
    };

    const companiesWithOwners = (await companies
      .find(
        { 'audit.createdByUserId': { $exists: true, $ne: null } },
        { projection: { _id: 1, audit: 1 } },
      )
      .toArray()) as LegacyCompany[];

    for (const company of companiesWithOwners) {
      const createdByUserId = toLegacyId(company.audit?.createdByUserId);

      pushOwnerMembership(
        createdByUserId,
        company._id,
        createdByUserId ?? undefined,
      );
    }

    const recruitersWithCompanies = (await users
      .find(
        { 'recruiterProfile.companyId': { $exists: true, $ne: null } },
        { projection: { _id: 1, recruiterProfile: 1 } },
      )
      .toArray()) as LegacyRecruiter[];

    for (const user of recruitersWithCompanies) {
      pushOwnerMembership(user._id, user.recruiterProfile?.companyId);
    }

    if (operations.length > 0) {
      const result = await memberships.bulkWrite(operations, {
        ordered: false,
      });

      logger.log(
        `Company memberships backfilled. Upserted: ${result.upsertedCount}.`,
      );

      return;
    }

    logger.log('Company memberships backfill skipped; no legacy links found.');
  },

  async down({ logger }) {
    await Promise.resolve();

    logger.log(
      'Company memberships rollback is a no-op to avoid removing tenant access data.',
    );
  },
};

export default migration;

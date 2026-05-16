import type { Provider } from '@nestjs/common';
import {
  DATABASE_LOCK_MANAGER,
  MIGRATION_ROLLBACK_RUNNER,
  MIGRATION_RUNNER,
  SEED_ROLLBACK_RUNNER,
  SEED_RUNNER,
} from '@src/shared/database/contracts/database.tokens';
import { DatabaseLockManager } from '@src/shared/database/locks/database-lock.manager';
import { MigrationRollbackRunner } from '@src/shared/database/migrations/runners/migration-rollback.runner';
import { MigrationRunner } from '@src/shared/database/migrations/runners/migration.runner';
import { SeedRollbackRunner } from '@src/shared/database/seeds/runners/seed-rollback.runner';
import { SeedRunner } from '@src/shared/database/seeds/runners/seed.runner';

export const databaseToolsProviders: Provider[] = [
  {
    provide: MIGRATION_RUNNER,
    useClass: MigrationRunner,
  },
  {
    provide: MIGRATION_ROLLBACK_RUNNER,
    useClass: MigrationRollbackRunner,
  },
  {
    provide: SEED_RUNNER,
    useClass: SeedRunner,
  },
  {
    provide: SEED_ROLLBACK_RUNNER,
    useClass: SeedRollbackRunner,
  },
  {
    provide: DATABASE_LOCK_MANAGER,
    useClass: DatabaseLockManager,
  },
];

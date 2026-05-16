import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseToolsModule } from '@src/shared/database/database-tools.module';
import { MIGRATION_ROLLBACK_RUNNER } from '@src/shared/database/contracts/database.tokens';
import type { MigrationRollbackRunnerInterface } from '@src/shared/database/migrations/contracts/migration-rollback-runner.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(DatabaseToolsModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const runner = app.get<MigrationRollbackRunnerInterface>(
      MIGRATION_ROLLBACK_RUNNER,
    );
    const result = await runner.run();

    Logger.log(
      `Migration down finished. Processed=${result.processedNames.length}, Skipped=${result.skippedNames.length}`,
      'MigrationDown',
    );
  } finally {
    await app.close();
  }
}

void bootstrap();

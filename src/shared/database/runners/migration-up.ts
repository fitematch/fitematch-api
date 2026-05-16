import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseToolsModule } from '@src/shared/database/database-tools.module';
import { MIGRATION_RUNNER } from '@src/shared/database/contracts/database.tokens';
import type { MigrationRunnerInterface } from '@src/shared/database/migrations/contracts/migration-runner.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(DatabaseToolsModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const runner = app.get<MigrationRunnerInterface>(MIGRATION_RUNNER);
    const result = await runner.run();

    Logger.log(
      `Migration up finished. Processed=${result.processedNames.length}, Skipped=${result.skippedNames.length}`,
      'MigrationUp',
    );
  } finally {
    await app.close();
  }
}

void bootstrap();

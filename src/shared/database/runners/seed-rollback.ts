import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseToolsModule } from '@src/shared/database/database-tools.module';
import { SEED_ROLLBACK_RUNNER } from '@src/shared/database/contracts/database.tokens';
import type { SeedRollbackRunnerInterface } from '@src/shared/database/seeds/contracts/seed-rollback-runner.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(DatabaseToolsModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const runner = app.get<SeedRollbackRunnerInterface>(SEED_ROLLBACK_RUNNER);
    const result = await runner.run();

    Logger.log(
      `Seed rollback finished. Processed=${result.processedNames.length}, Skipped=${result.skippedNames.length}`,
      'SeedRollback',
    );
  } finally {
    await app.close();
  }
}

void bootstrap();

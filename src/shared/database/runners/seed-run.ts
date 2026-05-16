import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseToolsModule } from '@src/shared/database/database-tools.module';
import { SEED_RUNNER } from '@src/shared/database/contracts/database.tokens';
import type { SeedRunnerInterface } from '@src/shared/database/seeds/contracts/seed-runner.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(DatabaseToolsModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const runner = app.get<SeedRunnerInterface>(SEED_RUNNER);
    const result = await runner.run();

    Logger.log(
      `Seed run finished. Processed=${result.processedNames.length}, Skipped=${result.skippedNames.length}`,
      'SeedRun',
    );
  } finally {
    await app.close();
  }
}

void bootstrap();

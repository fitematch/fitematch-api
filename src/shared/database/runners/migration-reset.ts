import { Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import type { Connection } from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { DatabaseToolsModule } from '@src/shared/database/database-tools.module';
import { MIGRATION_RUNNER } from '@src/shared/database/contracts/database.tokens';
import type { MigrationRunnerInterface } from '@src/shared/database/migrations/contracts/migration-runner.interface';

async function confirmReset(databaseName: string): Promise<boolean> {
  const readline = createInterface({ input, output });

  try {
    const answer = await readline.question(
      `This will drop the database "${databaseName}" and remove all collections. Continue? (y/N) `,
    );

    return answer.trim().toLowerCase() === 'y';
  } finally {
    readline.close();
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(DatabaseToolsModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const connection = app.get<Connection>(getConnectionToken());
    const runner = app.get<MigrationRunnerInterface>(MIGRATION_RUNNER);

    const shouldContinue = await confirmReset(connection.name);

    if (!shouldContinue) {
      Logger.warn('Migration reset cancelled by user.', 'MigrationReset');
      return;
    }

    Logger.warn(
      `Dropping database "${connection.name}" before re-running migrations.`,
      'MigrationReset',
    );

    await connection.dropDatabase();

    const result = await runner.run();

    Logger.log(
      `Migration reset finished. Processed=${result.processedNames.length}, Skipped=${result.skippedNames.length}`,
      'MigrationReset',
    );
  } finally {
    await app.close();
  }
}

void bootstrap();

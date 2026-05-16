import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Connection, Model } from 'mongoose';
import { DATABASE_LOCK_MANAGER } from '@src/shared/database/contracts/database.tokens';
import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';
import type { DatabaseLockManagerInterface } from '@src/shared/database/locks/contracts/database-lock-manager.interface';
import type { MigrationInterface } from '@src/shared/database/migrations/contracts/migration.interface';
import type { MigrationRunnerInterface } from '@src/shared/database/migrations/contracts/migration-runner.interface';
import {
  MigrationSchema,
  type MigrationDocument,
} from '@src/shared/database/migrations/schemas/migration.schema';
import { DatabaseFileUtils } from '@src/shared/database/utils/database-file.utils';

@Injectable()
export class MigrationRunner implements MigrationRunnerInterface {
  private readonly require = createRequire(__filename);
  private readonly logger = new Logger(MigrationRunner.name);
  private readonly filesDirectoryPath = path.resolve(__dirname, '../files');

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(MigrationSchema.name)
    private readonly migrationModel: Model<MigrationDocument>,
    @Inject(DATABASE_LOCK_MANAGER)
    private readonly lockManager: DatabaseLockManagerInterface,
  ) {}

  async run(): Promise<DatabaseRunResultDto> {
    return this.lockManager.executeWithLock('migrations', async () => {
      const files = await DatabaseFileUtils.listTimestampedFiles(
        this.filesDirectoryPath,
      );
      const executedMigrations = await this.migrationModel.find().lean().exec();
      const executedByName = new Map(
        executedMigrations.map((migration) => [migration.name, migration]),
      );
      const nextBatch = this.resolveNextBatch(executedMigrations);
      const processedNames: string[] = [];
      const skippedNames: string[] = [];

      for (const file of files) {
        const executedMigration = executedByName.get(file.name);

        if (executedMigration) {
          if (executedMigration.checksum !== file.checksum) {
            throw new Error(
              `Checksum mismatch detected for migration "${file.name}".`,
            );
          }

          skippedNames.push(file.name);
          continue;
        }

        const migration = this.loadMigration(file.absolutePath);

        this.logger.log(`Running migration: ${migration.name}`);

        await migration.up({
          connection: this.connection,
          logger: this.logger,
        });

        await this.migrationModel.create({
          name: migration.name,
          batch: nextBatch,
          checksum: file.checksum,
          executedAt: new Date(),
        });

        processedNames.push(migration.name);
        this.logger.log(`Migration completed: ${migration.name}`);
      }

      return {
        processedNames,
        skippedNames,
        batch: nextBatch,
      };
    });
  }

  private resolveNextBatch(
    executedMigrations: Array<{ batch?: number }>,
  ): number {
    const currentBatch = executedMigrations.reduce(
      (highestBatch, migration) => {
        return Math.max(highestBatch, migration.batch ?? 0);
      },
      0,
    );

    return currentBatch + 1;
  }

  private loadMigration(absolutePath: string): MigrationInterface {
    const importedFile = this.require(absolutePath) as {
      default?: MigrationInterface;
    };
    const migration = importedFile.default;

    if (!migration) {
      throw new Error(`Migration file "${absolutePath}" must export default.`);
    }

    return migration;
  }
}

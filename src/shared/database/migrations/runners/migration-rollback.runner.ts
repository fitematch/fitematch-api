import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Connection, Model } from 'mongoose';
import { DATABASE_LOCK_MANAGER } from '@src/shared/database/contracts/database.tokens';
import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';
import type { DatabaseLockManagerInterface } from '@src/shared/database/locks/contracts/database-lock-manager.interface';
import type { MigrationInterface } from '@src/shared/database/migrations/contracts/migration.interface';
import type { MigrationRollbackRunnerInterface } from '@src/shared/database/migrations/contracts/migration-rollback-runner.interface';
import {
  MigrationSchema,
  type MigrationDocument,
} from '@src/shared/database/migrations/schemas/migration.schema';

@Injectable()
export class MigrationRollbackRunner implements MigrationRollbackRunnerInterface {
  private readonly require = createRequire(__filename);
  private readonly logger = new Logger(MigrationRollbackRunner.name);
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
      const latestMigration = await this.migrationModel
        .findOne()
        .sort({ batch: -1, executedAt: -1, name: -1 })
        .lean()
        .exec();

      if (!latestMigration) {
        this.logger.log('No migrations available for rollback.');

        return {
          processedNames: [],
          skippedNames: [],
        };
      }

      const absolutePath = path.join(
        this.filesDirectoryPath,
        latestMigration.name,
      );
      const migration = this.loadMigration(absolutePath);

      this.logger.log(`Rolling back migration: ${migration.name}`);

      await migration.down({
        connection: this.connection,
        logger: this.logger,
      });

      await this.migrationModel
        .deleteOne({ name: latestMigration.name })
        .exec();

      this.logger.log(`Migration rollback completed: ${migration.name}`);

      return {
        processedNames: [migration.name],
        skippedNames: [],
        batch: latestMigration.batch,
      };
    });
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

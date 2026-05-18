import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Connection, Model } from 'mongoose';
import { DATABASE_LOCK_MANAGER } from '@src/shared/database/contracts/database.tokens';
import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';
import type { DatabaseLockManagerInterface } from '@src/shared/database/locks/contracts/database-lock-manager.interface';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';
import type { SeedRollbackRunnerInterface } from '@src/shared/database/seeds/contracts/seed-rollback-runner.interface';
import {
  SeedSchema,
  type SeedDocument,
} from '@src/shared/database/seeds/schemas/seed.schema';

@Injectable()
export class SeedRollbackRunner implements SeedRollbackRunnerInterface {
  private readonly require = createRequire(__filename);
  private readonly logger = new Logger(SeedRollbackRunner.name);
  private readonly filesDirectoryPath = path.resolve(__dirname, '../files');

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(SeedSchema.name)
    private readonly seedModel: Model<SeedDocument>,
    @Inject(DATABASE_LOCK_MANAGER)
    private readonly lockManager: DatabaseLockManagerInterface,
  ) {}

  async run(): Promise<DatabaseRunResultDto> {
    return this.lockManager.executeWithLock('seeds', async () => {
      const latestSeed = await this.seedModel
        .findOne()
        .sort({ executedAt: -1, name: -1 })
        .lean()
        .exec();

      if (!latestSeed) {
        this.logger.log('No seeds available for rollback.');

        return {
          processedNames: [],
          skippedNames: [],
        };
      }

      const absolutePath = path.join(this.filesDirectoryPath, latestSeed.name);
      const seed = this.loadSeed(absolutePath);

      if (!seed.rollback) {
        this.logger.log(`Seed "${seed.name}" does not provide rollback.`);

        return {
          processedNames: [],
          skippedNames: [seed.name],
        };
      }

      this.logger.log(`Rolling back seed: ${seed.name}`);

      await seed.rollback?.({
        connection: this.connection,
        logger: this.logger,
      });

      await this.seedModel.deleteOne({ name: latestSeed.name });

      this.logger.log(`Seed rollback completed: ${seed.name}`);

      return {
        processedNames: [seed.name],
        skippedNames: [],
      };
    });
  }

  private loadSeed(absolutePath: string): SeedInterface {
    const importedFile = this.require(absolutePath) as {
      default?: SeedInterface;
    };
    const seed = importedFile.default;

    if (!seed) {
      throw new Error(`Seed file "${absolutePath}" must export default.`);
    }

    return seed;
  }
}

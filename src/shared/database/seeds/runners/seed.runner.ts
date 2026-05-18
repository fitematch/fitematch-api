import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Connection, Model } from 'mongoose';
import { DATABASE_LOCK_MANAGER } from '@src/shared/database/contracts/database.tokens';
import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';
import type { DatabaseLockManagerInterface } from '@src/shared/database/locks/contracts/database-lock-manager.interface';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';
import type { SeedRunnerInterface } from '@src/shared/database/seeds/contracts/seed-runner.interface';
import {
  SeedSchema,
  type SeedDocument,
} from '@src/shared/database/seeds/schemas/seed.schema';
import { DatabaseFileUtils } from '@src/shared/database/utils/database-file.utils';

@Injectable()
export class SeedRunner implements SeedRunnerInterface {
  private readonly require = createRequire(__filename);
  private readonly logger = new Logger(SeedRunner.name);
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
      const files = await DatabaseFileUtils.listTimestampedFiles(
        this.filesDirectoryPath,
      );
      const executedSeeds = await this.seedModel.find().lean().exec();
      const executedByName = new Map(
        executedSeeds.map((seed) => [seed.name, seed]),
      );
      const processedNames: string[] = [];
      const skippedNames: string[] = [];

      for (const file of files) {
        const executedSeed = executedByName.get(file.name);

        if (executedSeed) {
          if (executedSeed.checksum !== file.checksum) {
            throw new Error(
              `Checksum mismatch detected for seed "${file.name}".`,
            );
          }

          skippedNames.push(file.name);
          continue;
        }

        const seed = this.loadSeed(file.absolutePath);

        this.logger.log(`Running seed: ${seed.name}`);

        await seed.run({
          connection: this.connection,
          logger: this.logger,
        });

        await this.seedModel.create([
          {
            name: seed.name,
            checksum: file.checksum,
            executedAt: new Date(),
          },
        ]);

        processedNames.push(seed.name);
        this.logger.log(`Seed completed: ${seed.name}`);
      }

      return {
        processedNames,
        skippedNames,
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

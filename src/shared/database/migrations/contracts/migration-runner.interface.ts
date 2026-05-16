import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';

export interface MigrationRunnerInterface {
  run(): Promise<DatabaseRunResultDto>;
}

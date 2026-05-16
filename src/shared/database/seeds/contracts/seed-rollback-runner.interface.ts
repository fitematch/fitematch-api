import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';

export interface SeedRollbackRunnerInterface {
  run(): Promise<DatabaseRunResultDto>;
}

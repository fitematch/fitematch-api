import type { DatabaseRunResultDto } from '@src/shared/database/dto/database-run-result.dto';

export interface SeedRunnerInterface {
  run(): Promise<DatabaseRunResultDto>;
}

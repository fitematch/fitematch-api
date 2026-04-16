import type { HealthCheckOutput } from '@src/modules/health-check/application/contracts/health-check.output';

export interface HealthCheckUseCaseInterface {
  execute(): HealthCheckOutput;
}

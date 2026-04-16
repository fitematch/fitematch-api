import type { HealthCheckOutput } from '@src/modules/health-check/application/contracts/health-check.output';
import type { HealthCheckUseCaseInterface } from '@src/modules/health-check/application/contracts/health-check.use-case.interface';

export class HealthCheckUseCase implements HealthCheckUseCaseInterface {
  execute(): HealthCheckOutput {
    return {
      healthy: true,
      name: 'API',
      version: process.env.npm_package_version ?? '0.0.1',
    };
  }
}

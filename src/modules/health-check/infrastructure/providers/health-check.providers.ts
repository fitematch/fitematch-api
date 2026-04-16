import type { HealthCheckUseCaseInterface } from '@src/modules/health-check/application/contracts/health-check.use-case.interface';
import { HealthCheckUseCase } from '@src/modules/health-check/application/use-cases/health-check.use-case';
import { HEALTH_CHECK_USE_CASE_INTERFACE } from '@src/modules/health-check/infrastructure/providers/health-check.tokens';

export const healthCheckProviders = [
  {
    provide: HEALTH_CHECK_USE_CASE_INTERFACE,
    useFactory: (): HealthCheckUseCaseInterface => new HealthCheckUseCase(),
  },
];

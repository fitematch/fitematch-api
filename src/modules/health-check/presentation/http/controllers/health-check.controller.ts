import { Controller, Get, Inject } from '@nestjs/common';
import type { HealthCheckUseCaseInterface } from '@src/modules/health-check/application/contracts/health-check.use-case.interface';
import { HEALTH_CHECK_USE_CASE_INTERFACE } from '@src/modules/health-check/infrastructure/providers/health-check.tokens';
import type { HealthCheckResponseDto } from '@src/modules/health-check/presentation/http/dto/health-check.response.dto';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    @Inject(HEALTH_CHECK_USE_CASE_INTERFACE)
    private readonly healthCheckUseCase: HealthCheckUseCaseInterface,
  ) {}

  @Get()
  get(): HealthCheckResponseDto {
    const output = this.healthCheckUseCase.execute();

    return {
      healthy: output.healthy,
      name: output.name,
      version: output.version,
    };
  }
}

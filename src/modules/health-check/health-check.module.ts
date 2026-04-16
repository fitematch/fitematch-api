import { Module } from '@nestjs/common';
import { HealthCheckController } from '@src/modules/health-check/adapters/http/controllers/health-check.controller';
import { healthCheckProviders } from '@src/modules/health-check/infrastructure/providers/health-check.providers';

@Module({
  controllers: [HealthCheckController],
  providers: [...healthCheckProviders],
})
export class HealthCheckModule {}

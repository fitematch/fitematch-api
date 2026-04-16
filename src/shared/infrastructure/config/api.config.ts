import { registerAs } from '@nestjs/config';
import { ApiConfig } from '@src/shared/infrastructure/config/api-config.interface';

const { APPLICATION_PORT } = process.env;
const parsedPort = Number.parseInt(APPLICATION_PORT ?? '', 10);

export const defaultApiConfig: ApiConfig = {
  port: Number.isNaN(parsedPort) ? 3000 : parsedPort,
};

export default registerAs('api', (): ApiConfig => defaultApiConfig);

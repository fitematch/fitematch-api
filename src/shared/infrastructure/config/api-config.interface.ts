import { registerAs } from '@nestjs/config';

const {
  APPLICATION_PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;

const parsedPort = Number.parseInt(APPLICATION_PORT ?? '', 10);

export interface ApiConfig {
  port: number;
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
  };
}

export const defaultApiConfig: ApiConfig = {
  port: Number.isNaN(parsedPort) ? 3000 : parsedPort,
  aws: {
    accessKeyId: AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? '',
    region: AWS_REGION ?? 'sa-east-1',
    bucketName: AWS_BUCKET_NAME ?? '',
  },
};

export default registerAs('api', (): ApiConfig => defaultApiConfig);

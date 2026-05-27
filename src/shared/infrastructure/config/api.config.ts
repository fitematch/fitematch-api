import { registerAs } from '@nestjs/config';

const {
  APPLICATION_PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_FROM_EMAIL,
  MAX_FILE_SIZE_MB,
} = process.env;

const parsedPort = Number.parseInt(APPLICATION_PORT ?? '', 10);
const maxFileSizeMb = Number.parseInt(MAX_FILE_SIZE_MB ?? '5', 10);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

export interface ApiConfig {
  port: number;
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    fromEmail: string;
  };
  uploads: {
    maxSizeBytes: number;
    allowedMimeTypes: RegExp;
  };
}

export const defaultApiConfig: ApiConfig = {
  port: Number.isNaN(parsedPort) ? 3000 : parsedPort,
  aws: {
    accessKeyId: AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? '',
    region: AWS_REGION ?? 'sa-east-1',
    bucketName: AWS_S3_BUCKET ?? '',
    fromEmail: AWS_FROM_EMAIL ?? 'no-reply@fitematch.com.br',
  },
  uploads: {
    maxSizeBytes: maxFileSizeBytes,
    allowedMimeTypes: /(jpg|jpeg|png|pdf)$/i,
  },
};

export default registerAs('api', (): ApiConfig => defaultApiConfig);

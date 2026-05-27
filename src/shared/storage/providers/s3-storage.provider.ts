import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { S3ClientConfig } from '@aws-sdk/client-s3';

import type { ApiConfig } from '@src/shared/infrastructure/config/api.config';
import type {
  StorageProviderInterface,
  StorageProviderUploadInput,
  StorageProviderUploadOutput,
} from '@src/shared/storage/contracts/storage.provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProviderInterface {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const apiConfig = this.configService.get<ApiConfig>('api');
    const awsConfig = apiConfig?.aws;

    const region =
      awsConfig?.region ??
      process.env.AWS_S3_REGION ??
      process.env.AWS_REGION ??
      'sa-east-1';
    const accessKeyId = (awsConfig?.accessKeyId ?? '').trim();
    const secretAccessKey = (awsConfig?.secretAccessKey ?? '').trim();
    const s3ClientOptions: S3ClientConfig = {
      region,
      ...(accessKeyId !== '' && secretAccessKey !== ''
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),
    };

    this.s3Client = new S3Client(s3ClientOptions);
  }

  public async upload({
    file,
    folder,
    userId,
  }: StorageProviderUploadInput): Promise<StorageProviderUploadOutput> {
    const apiConfig = this.configService.get<ApiConfig>('api');
    const awsConfig = apiConfig?.aws;
    const bucket = awsConfig?.bucketName ?? process.env.AWS_S3_BUCKET;
    const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;

    if (!bucket) {
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET / bucketName configuration is required when using S3 upload provider.',
      );
    }

    if (!publicBaseUrl) {
      throw new InternalServerErrorException(
        'AWS_S3_PUBLIC_BASE_URL environment variable is required when using S3 upload provider.',
      );
    }

    const extension = extname(file.originalname);
    const fileName = `${randomUUID()}${extension}`;
    const key = `${folder}/${userId}/${fileName}`.replace(/\\/g, '/');

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        key,
        url: `${publicBaseUrl.replace(/\/$/, '')}/${key}`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to upload file to S3: ${error.message}`,
        );
      }

      throw new InternalServerErrorException('Unknown AWS S3 execution error');
    }
  }
}

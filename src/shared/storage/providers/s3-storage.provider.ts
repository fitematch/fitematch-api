import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import type {
  StorageProviderInterface,
  StorageProviderUploadInput,
  StorageProviderUploadOutput,
} from '@src/shared/storage/contracts/storage.provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProviderInterface {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region:
        process.env.AWS_S3_REGION || process.env.AWS_REGION || 'sa-east-1',
    });
  }

  public async upload({
    file,
    folder,
    userId,
  }: StorageProviderUploadInput): Promise<StorageProviderUploadOutput> {
    const bucket = process.env.AWS_S3_BUCKET;
    const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;

    if (!bucket) {
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET environment variable is required when using S3 upload provider.',
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
  }
}

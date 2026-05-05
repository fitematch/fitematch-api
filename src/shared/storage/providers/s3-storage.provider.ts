import { Injectable, NotImplementedException } from '@nestjs/common';

import type {
  StorageProviderInterface,
  StorageProviderUploadInput,
  StorageProviderUploadOutput,
} from '@src/shared/storage/contracts/storage.provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProviderInterface {
  upload(
    input: StorageProviderUploadInput,
  ): Promise<StorageProviderUploadOutput> {
    void input;

    return Promise.reject(
      new NotImplementedException(
        'S3 storage provider is not implemented yet.',
      ),
    );
  }
}

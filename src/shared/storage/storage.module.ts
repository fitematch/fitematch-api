import { Module } from '@nestjs/common';

import { STORAGE_PROVIDER } from '@src/shared/storage/storage.tokens';
import { UploadFileService } from '@src/shared/storage/services/upload-file.service';
import { LocalStorageProvider } from '@src/shared/storage/providers/local-storage.provider';
import { S3StorageProvider } from '@src/shared/storage/providers/s3-storage.provider';

@Module({
  providers: [
    LocalStorageProvider,
    S3StorageProvider,
    UploadFileService,
    {
      provide: STORAGE_PROVIDER,
      inject: [LocalStorageProvider, S3StorageProvider],
      useFactory: (
        localStorageProvider: LocalStorageProvider,
        s3StorageProvider: S3StorageProvider,
      ) => {
        const storageDriver = process.env.STORAGE_DRIVER || 'local';

        return storageDriver === 's3'
          ? s3StorageProvider
          : localStorageProvider;
      },
    },
  ],
  exports: [UploadFileService, STORAGE_PROVIDER],
})
export class StorageModule {}

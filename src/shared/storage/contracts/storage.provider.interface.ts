import { UploadResourceEnum } from '@src/shared/storage/enums/upload-resource.enum';
import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';

export interface StorageProviderUploadInput {
  file: UploadedFileInterface;
  folder: string;
  userId: string;
  resource: UploadResourceEnum;
}

export interface StorageProviderUploadOutput {
  url: string;
  key: string;
}

export interface StorageProviderInterface {
  upload(
    input: StorageProviderUploadInput,
  ): Promise<StorageProviderUploadOutput>;
}

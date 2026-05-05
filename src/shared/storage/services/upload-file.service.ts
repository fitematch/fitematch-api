import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_PROVIDER } from '@src/shared/storage/storage.tokens';
import type { StorageProviderInterface } from '@src/shared/storage/contracts/storage.provider.interface';
import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';
import { UploadFolderEnum } from '@src/shared/storage/enums/upload-folder.enum';
import { UploadResourceEnum } from '@src/shared/storage/enums/upload-resource.enum';
import { validateUploadedFile } from '@src/shared/storage/utils/file-validation.utils';

export interface UploadFileServiceInput {
  file?: UploadedFileInterface;
  userId: string;
  folder: UploadFolderEnum;
  resource: UploadResourceEnum;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxSizeInBytes: number;
}

@Injectable()
export class UploadFileService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProviderInterface,
  ) {}

  async execute(input: UploadFileServiceInput): Promise<{ url: string }> {
    validateUploadedFile({
      file: input.file,
      allowedMimeTypes: input.allowedMimeTypes,
      allowedExtensions: input.allowedExtensions,
      maxSizeInBytes: input.maxSizeInBytes,
    });

    const file = input.file as NonNullable<UploadFileServiceInput['file']>;

    const result = await this.storageProvider.upload({
      file,
      folder: input.folder,
      userId: input.userId,
      resource: input.resource,
    });

    return {
      url: result.url,
    };
  }
}

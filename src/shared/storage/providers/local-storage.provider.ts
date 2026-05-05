import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { Injectable } from '@nestjs/common';

import type {
  StorageProviderInterface,
  StorageProviderUploadInput,
  StorageProviderUploadOutput,
} from '@src/shared/storage/contracts/storage.provider.interface';
import { buildUploadFileName } from '@src/shared/storage/utils/file-name.utils';

@Injectable()
export class LocalStorageProvider implements StorageProviderInterface {
  async upload({
    file,
    folder,
    userId,
  }: StorageProviderUploadInput): Promise<StorageProviderUploadOutput> {
    const rootPath = process.env.LOCAL_STORAGE_ROOT_PATH || 'public/uploads';
    const publicUrl = process.env.LOCAL_STORAGE_PUBLIC_URL || '/uploads';
    const targetDirectory = path.join(process.cwd(), rootPath, folder, userId);
    const fileName = buildUploadFileName(file.originalname);
    const filePath = path.join(targetDirectory, fileName);
    const relativePath = `${folder}/${userId}/${fileName}`;

    await mkdir(targetDirectory, { recursive: true });
    await writeFile(filePath, file.buffer);

    return {
      key: relativePath,
      url: `${publicUrl}/${relativePath}`.replace(/\\/g, '/'),
    };
  }
}

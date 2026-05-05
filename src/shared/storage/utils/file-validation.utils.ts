import path from 'node:path';
import { BadRequestException } from '@nestjs/common';
import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';

export interface FileValidationInput {
  file?: UploadedFileInterface;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxSizeInBytes: number;
}

export function validateUploadedFile({
  file,
  allowedMimeTypes,
  allowedExtensions,
  maxSizeInBytes,
}: FileValidationInput): void {
  if (!file) {
    throw new BadRequestException('File is required.');
  }

  if (file.size > maxSizeInBytes) {
    throw new BadRequestException('File too large.');
  }

  const extension = path.extname(file.originalname).toLowerCase();

  if (
    !allowedMimeTypes.includes(file.mimetype) ||
    !allowedExtensions.includes(extension)
  ) {
    throw new BadRequestException('Invalid file type.');
  }
}

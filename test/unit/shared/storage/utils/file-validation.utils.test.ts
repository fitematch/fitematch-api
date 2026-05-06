import { BadRequestException } from '@nestjs/common';

import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';
import { validateUploadedFile } from '@src/shared/storage/utils/file-validation.utils';

describe('FileValidationUtils', () => {
  const makeFile = (
    overrides?: Partial<UploadedFileInterface>,
  ): UploadedFileInterface => ({
    originalname: 'logo.png',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from('file'),
    ...overrides,
  });

  const input = {
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    allowedExtensions: ['.png', '.jpg', '.jpeg'],
    maxSizeInBytes: 5 * 1024 * 1024,
  };

  it('should not throw for a valid file', () => {
    expect(() =>
      validateUploadedFile({
        file: makeFile(),
        ...input,
      }),
    ).not.toThrow();
  });

  it('should throw when file is missing', () => {
    expect(() =>
      validateUploadedFile({
        file: undefined,
        ...input,
      }),
    ).toThrow(new BadRequestException('File is required.'));
  });

  it('should throw when file is too large', () => {
    expect(() =>
      validateUploadedFile({
        file: makeFile({ size: input.maxSizeInBytes + 1 }),
        ...input,
      }),
    ).toThrow(new BadRequestException('File too large.'));
  });

  it('should throw when mimetype is invalid', () => {
    expect(() =>
      validateUploadedFile({
        file: makeFile({ mimetype: 'application/pdf' }),
        ...input,
      }),
    ).toThrow(new BadRequestException('Invalid file type.'));
  });

  it('should throw when extension is invalid', () => {
    expect(() =>
      validateUploadedFile({
        file: makeFile({ originalname: 'logo.pdf' }),
        ...input,
      }),
    ).toThrow(new BadRequestException('Invalid file type.'));
  });
});

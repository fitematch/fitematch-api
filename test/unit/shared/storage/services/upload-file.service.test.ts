import { BadRequestException } from '@nestjs/common';

import { UploadFileService } from '@src/shared/storage/services/upload-file.service';
import { UploadFolderEnum } from '@src/shared/storage/enums/upload-folder.enum';
import { UploadResourceEnum } from '@src/shared/storage/enums/upload-resource.enum';
import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';
import type { StorageProviderInterface } from '@src/shared/storage/contracts/storage.provider.interface';

describe('UploadFileService', () => {
  const makeFile = (
    overrides?: Partial<UploadedFileInterface>,
  ): UploadedFileInterface => ({
    originalname: 'logo.png',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from('file'),
    ...overrides,
  });

  let storageProvider: jest.Mocked<StorageProviderInterface>;
  let service: UploadFileService;

  beforeEach(() => {
    storageProvider = {
      upload: jest.fn(),
    };

    service = new UploadFileService(storageProvider);
  });

  it('should validate and upload a valid file', async () => {
    storageProvider.upload.mockResolvedValue({
      url: '/uploads/logos/user-1/logo-1710000000000.png',
      key: 'logos/user-1/logo-1710000000000.png',
    });

    const file = makeFile();
    const result = await service.execute({
      file,
      userId: 'user-1',
      folder: UploadFolderEnum.LOGOS,
      resource: UploadResourceEnum.COMPANY_LOGO,
      allowedMimeTypes: ['image/png'],
      allowedExtensions: ['.png'],
      maxSizeInBytes: 5 * 1024 * 1024,
    });

    expect(storageProvider.upload).toHaveBeenCalledWith({
      file,
      folder: UploadFolderEnum.LOGOS,
      userId: 'user-1',
      resource: UploadResourceEnum.COMPANY_LOGO,
    });
    expect(result).toEqual({
      url: '/uploads/logos/user-1/logo-1710000000000.png',
    });
  });

  it('should not call storage provider when validation fails', async () => {
    await expect(
      service.execute({
        file: makeFile({ mimetype: 'application/pdf' }),
        userId: 'user-1',
        folder: UploadFolderEnum.LOGOS,
        resource: UploadResourceEnum.COMPANY_LOGO,
        allowedMimeTypes: ['image/png'],
        allowedExtensions: ['.png'],
        maxSizeInBytes: 5 * 1024 * 1024,
      }),
    ).rejects.toThrow(new BadRequestException('Invalid file type.'));

    expect(storageProvider.upload).not.toHaveBeenCalled();
  });

  it('should throw when file is missing', async () => {
    await expect(
      service.execute({
        file: undefined,
        userId: 'user-1',
        folder: UploadFolderEnum.RESUMES,
        resource: UploadResourceEnum.CANDIDATE_RESUME,
        allowedMimeTypes: ['application/pdf'],
        allowedExtensions: ['.pdf'],
        maxSizeInBytes: 10 * 1024 * 1024,
      }),
    ).rejects.toThrow(new BadRequestException('File is required.'));

    expect(storageProvider.upload).not.toHaveBeenCalled();
  });
});

import {
  buildUploadFileName,
  sanitizeFileName,
} from '@src/shared/storage/utils/file-name.utils';

describe('FileNameUtils', () => {
  describe('sanitizeFileName', () => {
    it('should sanitize special chars, spaces and accents', () => {
      const result = sanitizeFileName('BlúeFit Logo 2025!!.PNG');

      expect(result).toBe('bluefit-logo-2025');
    });

    it('should fallback to file when the base name becomes empty', () => {
      const result = sanitizeFileName('@@@.pdf');

      expect(result).toBe('file');
    });
  });

  describe('buildUploadFileName', () => {
    it('should build a safe file name with timestamp and preserve extension', () => {
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1710000000000);

      const result = buildUploadFileName('BlueFit Logo.png');

      expect(result).toBe('bluefit-logo-1710000000000.png');

      dateNowSpy.mockRestore();
    });

    it('should normalize extension to lowercase', () => {
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1710000000000);

      const result = buildUploadFileName('Currículo Final.PDF');

      expect(result).toBe('curriculo-final-1710000000000.pdf');

      dateNowSpy.mockRestore();
    });
  });
});

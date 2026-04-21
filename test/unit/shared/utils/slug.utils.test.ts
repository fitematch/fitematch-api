import { SlugUtils } from '@src/shared/utils/slug.utils';

describe('SlugUtils', () => {
  describe('generate', () => {
    it('should generate a normalized slug', () => {
      expect(SlugUtils.generate(' Personal Trainer Sênior ')).toBe(
        'personal-trainer-senior',
      );
    });

    it('should return an empty string when value is empty', () => {
      expect(SlugUtils.generate('')).toBe('');
    });

    it('should collapse repeated separators and remove special characters', () => {
      expect(SlugUtils.generate('Fit---Match @@@  API')).toBe('fit-match-api');
    });
  });

  describe('generateWithSuffix', () => {
    it('should append a numeric suffix to the generated slug', () => {
      expect(SlugUtils.generateWithSuffix('Personal Trainer Sênior', 2)).toBe(
        'personal-trainer-senior-2',
      );
    });

    it('should return only the suffix when the base slug is empty', () => {
      expect(SlugUtils.generateWithSuffix('@@@', 3)).toBe('3');
    });
  });
});

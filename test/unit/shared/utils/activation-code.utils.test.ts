import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

describe('ActivationCodeUtils', () => {
  describe('generateSixDigits', () => {
    it('should return a six digit code as a string', () => {
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

      const result = ActivationCodeUtils.generateSixDigits();

      expect(result).toBe('100000');
      expect(result).toHaveLength(6);

      randomSpy.mockRestore();
    });

    it('should generate the upper bound correctly', () => {
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999999);

      const result = ActivationCodeUtils.generateSixDigits();

      expect(result).toBe('999999');
      expect(result).toMatch(/^\d{6}$/);

      randomSpy.mockRestore();
    });
  });
});

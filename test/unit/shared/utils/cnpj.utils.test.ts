import { CnpjUtils } from '@src/shared/utils/cnpj.utils';

describe('CnpjUtils', () => {
  let cnpjUtils: CnpjUtils;

  beforeEach(() => {
    cnpjUtils = new CnpjUtils();
  });

  describe('normalize', () => {
    it('should remove non-digit characters from cnpj', () => {
      expect(cnpjUtils.normalize('12.345.678/0001-90')).toBe('12345678000190');
    });

    it('should return undefined when value is undefined', () => {
      expect(cnpjUtils.normalize(undefined)).toBeUndefined();
    });

    it('should return undefined when value has no digits', () => {
      expect(cnpjUtils.normalize('abc')).toBeUndefined();
    });
  });

  describe('isValid', () => {
    it('should return true for a valid cnpj', () => {
      expect(cnpjUtils.isValid('11.222.333/0001-81')).toBe(true);
    });

    it('should return false when cnpj is undefined', () => {
      expect(cnpjUtils.isValid(undefined)).toBe(false);
    });

    it('should return false when cnpj does not have 14 digits', () => {
      expect(cnpjUtils.isValid('123')).toBe(false);
    });

    it('should return false when cnpj has repeated digits', () => {
      expect(cnpjUtils.isValid('11.111.111/1111-11')).toBe(false);
    });

    it('should return false when cnpj has invalid check digits', () => {
      expect(cnpjUtils.isValid('11.222.333/0001-82')).toBe(false);
    });
  });

  describe('calculateCheckDigit', () => {
    it('should return 0 when remainder is less than 2 for a 12-digit base', () => {
      expect(
        (
          cnpjUtils as unknown as {
            calculateCheckDigit(baseValue: string): number;
          }
        ).calculateCheckDigit('000000000000'),
      ).toBe(0);
    });

    it('should return 1 when remainder is greater than or equal to 2 for a 13-digit base', () => {
      expect(
        (
          cnpjUtils as unknown as {
            calculateCheckDigit(baseValue: string): number;
          }
        ).calculateCheckDigit('1122233300018'),
      ).toBe(1);
    });
  });
});

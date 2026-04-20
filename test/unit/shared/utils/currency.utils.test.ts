import CurrencyUtils from '@src/shared/utils/currency.utils';

describe('CurrencyUtils', () => {
  let currencyUtils: CurrencyUtils;

  beforeEach(() => {
    currencyUtils = new CurrencyUtils();
  });

  describe('formatBRL', () => {
    it('should format a number as brazilian real currency', () => {
      expect(currencyUtils.formatBRL(1500)).toBe('R$\u00a01.500,00');
      expect(currencyUtils.formatBRL(99.9)).toBe('R$\u00a099,90');
    });
  });
});

import DateUtils from '@src/shared/utils/date.utils';

describe('DateUtils', () => {
  let dateUtils: DateUtils;

  beforeEach(() => {
    dateUtils = new DateUtils();
  });

  describe('formatDate', () => {
    it('should format a date from yyyy-mm-dd to dd/mm/yyyy', () => {
      const result = dateUtils.formatDate('1998-07-29');

      expect(result).toBe('29/07/1998');
    });
  });
});

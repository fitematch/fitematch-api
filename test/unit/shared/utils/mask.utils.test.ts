import { MaskUtils } from '@src/shared/utils/mask.utils';

describe('MaskUtils', () => {
  let maskUtils: MaskUtils;

  beforeEach(() => {
    maskUtils = new MaskUtils();
  });

  describe('formatPhone', () => {
    it('should return empty string for nullish values', () => {
      expect(maskUtils.formatPhone(null)).toBe('');
      expect(maskUtils.formatPhone(undefined)).toBe('');
    });

    it('should format partial and full phone numbers', () => {
      expect(maskUtils.formatPhone('1')).toBe('(1');
      expect(maskUtils.formatPhone('11999')).toBe('(11) 999');
      expect(maskUtils.formatPhone('1198765432')).toBe('(11) 9876-5432');
      expect(maskUtils.formatPhone('11987654321')).toBe('(11) 98765-4321');
    });
  });

  describe('formatCPF', () => {
    it('should format cpf progressively', () => {
      expect(maskUtils.formatCPF('')).toBe('');
      expect(maskUtils.formatCPF('123')).toBe('123');
      expect(maskUtils.formatCPF('123456')).toBe('123.456');
      expect(maskUtils.formatCPF('123456789')).toBe('123.456.789');
      expect(maskUtils.formatCPF('12345678901')).toBe('123.456.789-01');
    });
  });

  describe('formatCNPJ', () => {
    it('should format cnpj progressively', () => {
      expect(maskUtils.formatCNPJ(undefined)).toBe('');
      expect(maskUtils.formatCNPJ('12')).toBe('12');
      expect(maskUtils.formatCNPJ('12345')).toBe('12.345');
      expect(maskUtils.formatCNPJ('12345678')).toBe('12.345.678');
      expect(maskUtils.formatCNPJ('123456789012')).toBe('12.345.678/9012');
      expect(maskUtils.formatCNPJ('12ab3456789012')).toBe('12.AB3.456/7890-12');
    });
  });

  describe('formatRG', () => {
    it('should format rg progressively', () => {
      expect(maskUtils.formatRG(null)).toBe('');
      expect(maskUtils.formatRG('12')).toBe('12');
      expect(maskUtils.formatRG('12345')).toBe('12.345');
      expect(maskUtils.formatRG('12345678')).toBe('12.345.678');
      expect(maskUtils.formatRG('12345678x')).toBe('12.345.678-X');
    });
  });

  describe('formatCEP', () => {
    it('should format cep progressively', () => {
      expect(maskUtils.formatCEP('')).toBe('');
      expect(maskUtils.formatCEP('12345')).toBe('12345');
      expect(maskUtils.formatCEP('12345678')).toBe('12345-678');
    });
  });

  describe('formatCREF', () => {
    it('should format cref progressively', () => {
      expect(maskUtils.formatCREF(null)).toBe('');
      expect(maskUtils.formatCREF('123456')).toBe('123456');
      expect(maskUtils.formatCREF('123456g')).toBe('123456-G');
      expect(maskUtils.formatCREF('123456gsp')).toBe('123456-G/SP');
    });
  });

  describe('formatPassport', () => {
    it('should normalize passport number', () => {
      expect(maskUtils.formatPassport(undefined)).toBe('');
      expect(maskUtils.formatPassport('ab123456')).toBe('AB123456');
      expect(maskUtils.formatPassport('ab-12.3456')).toBe('AB123456');
    });
  });
});
